const ROWS_COLUMNS_NUM = 8;
const CELL_EDGE_SIZE = 100;
const PIECE_RADIUS = 40;

const MOVE_EFFECT_TOTAL_TIME = 300;
const MOVE_EFFECT_ITERATIONS = 10;

const playerTypes = {
	HUMAN: "human",
	COMPUTER: "computer"
};

class Board {

	constructor(player1Color, player2Type, player2Color, startingColor, computerLevel, sounds,
				highlightMoves){
		this._boardArray = null;
		this._player1 = null;
		this._player2 = null;
		this._currentPlayer = null;
		this._piecesManager = new PiecesManager();
		this._drawer = null;
		this._sounds = sounds;
		this._highlightMoves = highlightMoves;
		this._init(player1Color, player2Type, player2Color, startingColor, computerLevel);
	}

	_init(player1Color, player2Type, player2Color, startingColor, computerLevel){
		this._initBoardArray();
		this._initPieces(player1Color, player2Color, CELL_EDGE_SIZE);
		const boardElement = document.getElementById("board");
		const boardContext = boardElement.getContext("2d");
		this._drawer = new Drawer(boardContext, ROWS_COLUMNS_NUM, CELL_EDGE_SIZE, PIECE_RADIUS);
		this._initPlayers(player1Color, player2Type, player2Color, startingColor, computerLevel,
			boardElement);
	}

	_initBoardArray(){
		this._boardArray = [
			[0,-1,0,0,0,1,0,1],
			[-1,0,-1,0,0,0,1,0],
			[0,-1,0,0,0,1,0,1],
			[-1,0,-1,0,0,0,1,0],
			[0,-1,0,0,0,1,0,1],
			[-1,0,-1,0,0,0,1,0],
			[0,-1,0,0,0,1,0,1],
			[-1,0,-1,0,0,0,1,0]
		];
	}

	_initPlayers(player1Color, player2Type, player2Color, startingColor, computerLevel, boardElement){
		const postMoveFunc = this._getPostMoveFunc();
		this._player1 = new HumanPlayer(this._boardArray, playerIds.PLAYER_1, player1Color, postMoveFunc,
			this._piecesManager, boardElement, this._drawer);
		if (player2Type === playerTypes.HUMAN) {
			this._player2 = new HumanPlayer(this._boardArray, playerIds.PLAYER_2, player2Color, postMoveFunc,
				this._piecesManager, boardElement, this._drawer);
		}
		else{
			this._player2 = new ComputerPlayer(this._boardArray, playerIds.PLAYER_2, player2Color, postMoveFunc,
				computerLevel);
		}
		if (player1Color === startingColor){
			this._currentPlayer = this._player1;
		}
		else{
			this._currentPlayer = this._player2;
		}
	}

	_initPieces(player1Color, player2Color){
		for (let i=0; i<ROWS_COLUMNS_NUM; i++){
			for (let j=0; j<ROWS_COLUMNS_NUM; j++){
				if (this._boardArray[i][j] !== 0){
					const playerColor = (this._boardArray[i][j] > 0) ? player1Color : player2Color;
					this._piecesManager.createAndAddNewPiece(playerColor, i, j);
				}
			}
		}
	}

	play(){
		this._drawGame();
		this._currentPlayer.play();
	}

	_getPostMoveFunc(){
		return (playerId, fromRow, fromColumn, toRow, toColumn) => {
			const piece = this._piecesManager.getPiece(fromRow, fromColumn);
			const moveEffectSingleIterationTime = MOVE_EFFECT_TOTAL_TIME / MOVE_EFFECT_ITERATIONS;
			const xDelta = ((toRow - fromRow) * CELL_EDGE_SIZE) / MOVE_EFFECT_ITERATIONS;
			const yDelta = ((toColumn - fromColumn) * CELL_EDGE_SIZE) / MOVE_EFFECT_ITERATIONS;
			for (let i = 0; i < MOVE_EFFECT_ITERATIONS; i++) {
				setTimeout(() => {
					piece.boardX += xDelta;
					piece.boardY += yDelta;
					this._drawGame();
				}, i * moveEffectSingleIterationTime);
			}
			setTimeout(() => {
				this._postMoveAction(playerId, fromRow, fromColumn, toRow, toColumn);
			}, MOVE_EFFECT_TOTAL_TIME)
		};
	}

	_postMoveAction(playerId, fromRow, fromColumn, toRow, toColumn){
		BoardRules.applyMoveOnBoard(this._boardArray, fromRow, fromColumn, toRow, toColumn);
		this._updatePieces(fromRow, fromColumn, toRow, toColumn);
		if (BoardRules.isGameEnded(this._boardArray, playerId)){
			setTimeout(() => alert("Game Ended!"), 500);
		}
		else {
			let inContinuousMoveMode = true;
			if (!BoardRules.canPerformAnotherMove(this._boardArray, playerId, fromRow, fromColumn, toRow, toColumn)){
				this._currentPlayer = this._getNextPlayer(this._currentPlayer);
				inContinuousMoveMode = false;
			}
			this._currentPlayer.inContinuousMoveMode = inContinuousMoveMode;
			this.play(inContinuousMoveMode);
		}
	}

	_updatePieces(fromRow, fromColumn, toRow, toColumn){
		if (BoardRules.pieceIsQueen(this._boardArray, toRow, toColumn)){
			const movingPiece = this._piecesManager.getPiece(toRow, toColumn);
			movingPiece.changePieceTypeToQueen();
		}
		if (BoardRules.isJumpMove(fromRow, fromColumn, toRow, toColumn)){
			const opponentPieceRow = BoardRules.getJumpedOverRowColumn(fromRow, toRow);
			const opponentPieceColumn = BoardRules.getJumpedOverRowColumn(fromColumn, toColumn);
			this._piecesManager.deletePiece(opponentPieceRow, opponentPieceColumn);
		}
	}

	_getNextPlayer(currentPlayer){
		return (currentPlayer === this._player1) ? this._player2 : this._player1;
	}

	_drawGame(){
		this._drawer.drawBoard();
		this._drawAllPieces();
	}

	_drawAllPieces(){
		const pieces = this._piecesManager.getAllPieces();
		for (let i=0; i<pieces.length; i++){
			const piece = pieces[i];
			this._drawer.drawPiece(piece.playerColor, piece.boardX, piece.boardY,
				piece.pieceType === piecesTypes.QUEEN_PIECE);
		}
	}

}