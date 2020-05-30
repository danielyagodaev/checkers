const piecesTypes = {
	SIMPLE_PIECE: 1,
	QUEEN_PIECE: 2
};

class Piece {

	constructor(playerColor, boardX, boardY){
		this._playerColor = playerColor;
		this._boardX = boardX;
		this._boardY = boardY;
		this._pieceType = piecesTypes.SIMPLE_PIECE;
	}

	get playerColor(){
		return this._playerColor;
	}

	get boardX(){
		return this._boardX;
	}

	get boardY(){
		return this._boardY;
	}

	get pieceType(){
		return this._pieceType;
	}

	set boardX(boardX){
		this._boardX = boardX;
	}

	set boardY(boardY){
		this._boardY = boardY;
	}

	changePieceTypeToQueen(){
		this._pieceType = piecesTypes.QUEEN_PIECE;
	}
}