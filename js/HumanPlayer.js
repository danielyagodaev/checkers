const MOUSE_DOWN_EVENT = "mousedown";
const MOUSE_MOVE_EVENT = "mousemove";

class HumanPlayer {

	constructor(playerId, gameBoard, boardElement, playerColor, cursorColor, drawer, callback){
		this._playerId = playerId;
		this._gameBoard = gameBoard;
		this._boardElement = boardElement;
		this._playerColor = playerColor;
		this._cursorColor = cursorColor;
		this._drawer = drawer;
		this._callback = callback;
		this._cursorRow = 0;
		this._cursorColumn = 0;
		this._selectedCursorRow = null;
		this._selectedCursorColumn = null;
		this._eventListener = (e) => {this._cursorMovementEventListener(e)};
	}

	get playerColor(){
		return this._playerColor;
	}

	get cursorRow(){
		return this._cursorRow;
	}

	get cursorColumn(){
		return this._cursorColumn;
	}

	play(){
		this._drawer.drawCursor(this._cursorRow, this._cursorColumn, this._cursorColor);
		this._setEventListeners();
	}

	_setEventListeners(){
		this._boardElement.addEventListener(MOUSE_DOWN_EVENT, this._eventListener);
		this._boardElement.addEventListener(MOUSE_MOVE_EVENT, this._eventListener);
	}

	_removeEventListeners(){
		this._boardElement.removeEventListener(MOUSE_DOWN_EVENT, this._eventListener);
		this._boardElement.removeEventListener(MOUSE_MOVE_EVENT, this._eventListener);
	}

	_cursorMovementEventListener(e){
		this._removeEventListeners();
		const cellRow = HumanPlayer.transformCoordinateIntoCellNumber(e.offsetX);
		const cellColumn = HumanPlayer.transformCoordinateIntoCellNumber(e.offsetY);
		if (cellRow >=0 && cellRow < boardRowsColumns && cellColumn >= 0 && cellColumn < boardRowsColumns){
			if (e.type === MOUSE_MOVE_EVENT){	
				if (!(this._cellIsAlreadyHighlighted(this._cursorRow, this._cursorColumn))){
					this._drawer.removeCursor(this._cursorRow, this._cursorColumn);
					const piece = this._gameBoard.getPiece(this._cursorRow, this._cursorColumn);
					if (piece !== null){
						this._drawer.drawPiece(piece.playerColor, piece.boardX, piece.boardY, piece.pieceType === piecesTypes.QUEEN_PIECE);
					}
				}
				this._cursorRow = cellRow;
				this._cursorColumn = cellColumn;
				if (!(this._cellIsAlreadyHighlighted(this._cursorRow, this._cursorColumn))){
					this._drawer.drawCursor(cellRow, cellColumn, this._cursorColor);
				}
				this._setEventListeners();
			}

			else if (e.type === MOUSE_DOWN_EVENT){
				if (this._selectedCursorRow === null && this._selectedCursorColumn === null){
					if (this._gameBoard.canSelectPiece(this._playerId, this._cursorRow, this._cursorColumn)){
						this._drawer.drawCursor(this._cursorRow, this._cursorColumn, "red");
						this._selectedCursorRow = cellRow;
						this._selectedCursorColumn = cellColumn;
					}
					this._setEventListeners();
				}
				else{
					if (this._selectedCursorRow === cellRow && this._selectedCursorColumn === cellColumn){
						this._drawer.drawCursor(cellRow, cellColumn, this._cursorColor);
						this._selectedCursorRow = null;
						this._selectedCursorColumn = null;
						this._setEventListeners();
					}
					else if (this._gameBoard.canMove(this._playerId, this._selectedCursorRow, this._selectedCursorColumn, cellRow, cellColumn)){	
						const fromRow = this._selectedCursorRow;
						const fromColumn = this._selectedCursorColumn;
						this._selectedCursorRow = null;
						this._selectedCursorColumn = null;
						this._callback(fromRow, fromColumn, cellRow, cellColumn);
					}
					else{
						this._setEventListeners();
					}
				}

			}
		}
		else{
			this._setEventListeners();
		}
	}

	_cellIsAlreadyHighlighted(cellRow, cellColumn){
		if (this._selectedCursorRow === cellRow && this._selectedCursorColumn === cellColumn){
			return true;
		}
		return false;
	}

	static transformCoordinateIntoCellNumber(toConvert){
	    return (Math.floor(toConvert / 100));
	}

}