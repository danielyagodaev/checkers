const ROWS_COLUMNS_NUM = 8;
const CELL_EDGE_SIZE = 100;
const PIECE_RADIUS = 40;

const MOVE_EFFECT_TOTAL_TIME = 300;
const MOVE_EFFECT_ITERATIONS = 10;

class Board {

	constructor(player1Type, player1Color, player2Type, player2Color, startingColor, computerLevel, sounds,
				highlightMoves){
		this._boardArray = null;
		this._boardRules = null;
		this._player1 = null;
		this._player2 = null;
		this._currentPlayer = null;
		this._piecesMap = new Map();
		this._drawer = null;
		this._sounds = sounds;
		this._highlightMoves = highlightMoves;
		this._init(player1Type, player1Color, player2Type, player2Color, startingColor, computerLevel);
	}

	_init(player1Type, player1Color, player2Type, player2Color, startingColor, computerLevel){
		this._initBoardArray();
		this._initPieces(player1Color, player2Color, CELL_EDGE_SIZE);
		this._boardRules = new BoardRules(this._boardArray, this._piecesMap);
		const boardElement = document.getElementById("board");
		const boardContext = boardElement.getContext("2d");
		this._drawer = new Drawer(boardContext, ROWS_COLUMNS_NUM, CELL_EDGE_SIZE, PIECE_RADIUS);
		this._initPlayers(player1Type, player1Color, player2Type, player2Color, startingColor, computerLevel,
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

	_initPlayers(player1Type, player1Color, player2Type, player2Color, startingColor, computerLevel, boardElement){
		const postMoveFunc = this._getPostMoveFunc();
		this._player1 = new HumanPlayer(playerIds.PLAYER_1, player1Color, this._boardRules, postMoveFunc,
			boardElement, this._drawer);
		this._player2 = new HumanPlayer(playerIds.PLAYER_2, player2Color, this._boardRules, postMoveFunc,
			boardElement, this._drawer);
		if (player1Color === startingColor){
			this._currentPlayer = this._player1;
		}
		else{
			this._currentPlayer = this._player2;
		}
	}

	_initPieces(player1Color, player2Color, CELL_EDGE_SIZE){
		let piecesCount = 0;
		for (let i=0; i<this._boardArray.length; i++){
			for (let j=0; j<this._boardArray[i].length; j++){
				if (this._boardArray[i][j] !== 0){
					const boardX = this._getCoordinateOnBoard(i, CELL_EDGE_SIZE);
					const boardY = this._getCoordinateOnBoard(j, CELL_EDGE_SIZE);
					const playerColor = (this._boardArray[i][j] > 0) ? player1Color : player2Color;
					const piece = new Piece(playerColor, boardX, boardY);
					this._piecesMap.set(++piecesCount, piece);
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
			const piece = this._boardRules.getPiece(fromRow, fromColumn);
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
		this._boardRules.applyMoveOnBoard(fromRow, fromColumn, toRow, toColumn);
		if (this._boardRules.isGameEnded(playerId)){
			alert("Game Ended!");
		}
		else {
			let inContinuousMoveMode = true;
			if (!this._boardRules.canPerformAnotherMove(playerId, fromRow, fromColumn, toRow, toColumn)){
				this._currentPlayer = this._getNextPlayer(this._currentPlayer);
				inContinuousMoveMode = false;
			}
			this._currentPlayer.inContinuousMoveMode = inContinuousMoveMode;
			this.play(inContinuousMoveMode);
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
		for (const [_, piece] of this._piecesMap){
			this._drawer.drawPiece(piece.playerColor, piece.boardX, piece.boardY,
				piece.pieceType === piecesTypes.QUEEN_PIECE);
		}
	}

	_getCoordinateOnBoard(x){
		return (x * CELL_EDGE_SIZE) + (0.5 * CELL_EDGE_SIZE);
	}

}