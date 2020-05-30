class Board {

	constructor(boardArray, callback){
		this._boardArray = boardArray;
		this._piecesMap = new Map();
		this._callback = callback;
	}

	initPieces(player1Color, player2Color, squareEdgeSize){
		let piecesCount = 0;
		for (let i=0; i<this._boardArray.length; i++){
			for (let j=0; j<this._boardArray[i].length; j++){
				if (boardArray[i][j] !== 0){
					const boardX = this._getCoordinateOnBoard(i, squareEdgeSize);
					const boardY = this._getCoordinateOnBoard(j, squareEdgeSize);
					const playerColor = (boardArray[i][j] === playerIdentifiers.PLAYER_1) ? player1Color : player2Color;
					const piece = new Piece(playerColor, boardX, boardY);
					this._piecesMap.set(++piecesCount, piece);
				}
			}
		}
	}

	get piecesMap(){
		return this._piecesMap;
	}

	_getCoordinateOnBoard(x){
		return (x * squareEdgeSize) + (0.5 * squareEdgeSize);
	}

	isEmptyCell(cellRow, cellColumn){
		return (this._boardArray[cellRow][cellColumn] === 0);
	}

	pieceBelongsToPlayer(playerId, cellRow, cellColumn){
		return ((this._boardArray[cellRow][cellColumn] * playerId) > 0);
	}

	getPiece(cellRow, cellColumn){
		if (this.hasPiece(cellRow, cellColumn)){
			for (const [pieceId, piece] of this._piecesMap){
				const boardX = piece.boardX;
				const boardY = piece.boardY;
				const boardRow = Math.floor(boardX / 100);
				const boardColumn = Math.floor(boardY / 100);
				if (cellRow === boardRow && cellColumn === boardColumn){
					return piece;
				}
			}
		}
		else{
			return null;
		}
	}

	hasPiece(cellRow, cellColumn){
		return (this._boardArray[cellRow][cellColumn] !== 0);
	}

	isGameEnded(){
		return false;
	}

	canSelectPiece(playerId, cellRow, cellColumn){
		return this.pieceBelongsToPlayer(playerId, cellRow, cellColumn);
	}

	canMove(playerId, fromRow, fromColumn, toRow, toColumn){
		if ((toRow >= 0) && (toRow < this._boardArray.length) && (toColumn >= 0) && (toColumn < this._boardArray[toRow].length) && (this.isEmptyCell(toRow, toColumn))){
			if ((Math.abs(fromRow - toRow) === 1) && (Math.abs(fromColumn - toColumn) === 1)){
				return true;
			}
			else if ((Math.abs(fromRow - toRow) === 2) && (Math.abs(fromColumn - toColumn) === 2)){	
				const middleRow = (fromRow + toRow) / 2;
				const middleColumn = (fromColumn + toColumn) / 2;
				const opponentId = this.getOpponentId(playerId);
				return this.pieceBelongsToPlayer(opponentId, middleRow, middleColumn);
			}
		}
		return false;
	}

	getOpponentId(playerId){
		return playerId * (-1);
	}



}