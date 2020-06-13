const MOUSE_DOWN_EVENT = "mousedown";
const MOUSE_MOVE_EVENT = "mousemove";

const playerIds = {
	PLAYER_1: 1,
	PLAYER_2: -1
};

const cursorColors = {
	PLAYER_1: "yellow",
	PLAYER_2: "blue",
	SELECTED: "red"
};

class HumanPlayer {

	constructor(playerId, playerColor, boardRules, postMoveFunc, boardElement, drawer){
		this._playerId = playerId;
		this._playerColor = playerColor;
		this._boardRules = boardRules;
		this._postMoveFunc = postMoveFunc;
		this._cursorColor = (playerId === playerIds.PLAYER_1) ? cursorColors.PLAYER_1 : cursorColors.PLAYER_2;
		this._boardElement = boardElement;
		this._drawer = drawer;
		this._cursorRow = 0;
		this._cursorColumn = 0;
		this._selectedCursorRow = null;
		this._selectedCursorColumn = null;
		this._inContinuousMoveMode = false;
		this._eventListener = (e) => {this._cursorMovementEventListener(e)};
	}

	get playerColor(){
		return this._playerColor;
	}

	set inContinuousMoveMode(inContinuousMoveMode){
		this._inContinuousMoveMode = inContinuousMoveMode;
	}

	play(){
		if (this._inContinuousMoveMode){
			this._selectedCursorRow = this._cursorRow;
			this._selectedCursorColumn = this._cursorColumn;
			this._drawer.drawCursor(this._selectedCursorRow, this._selectedCursorColumn, cursorColors.SELECTED);
		}
		else {
			this._drawer.drawCursor(this._cursorRow, this._cursorColumn, this._cursorColor);
		}
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
		const cellRow = HumanPlayer._transformCoordinateIntoCellNumber(e.offsetX);
		const cellColumn = HumanPlayer._transformCoordinateIntoCellNumber(e.offsetY);
		if (cellRow >=0 && cellRow < ROWS_COLUMNS_NUM && cellColumn >= 0 && cellColumn < ROWS_COLUMNS_NUM){
			if (e.type === MOUSE_MOVE_EVENT){	
				this._handleMouseMoveEvent(cellRow, cellColumn);
			}
			else if (e.type === MOUSE_DOWN_EVENT){
				this._handleMouseDownEvent(cellRow, cellColumn);
			}
		}
		else{
			this._setEventListeners();
		}
	}

	_handleMouseMoveEvent(cellRow, cellColumn){
		if (!(this._cellIsAlreadyHighlighted(this._cursorRow, this._cursorColumn))){
			this._drawer.removeCursor(this._cursorRow, this._cursorColumn);
			const piece = this._boardRules.getPiece(this._cursorRow, this._cursorColumn);
			if (piece !== null){
				this._drawer.drawPiece(piece.playerColor, piece.boardX, piece.boardY,
					piece.pieceType === piecesTypes.QUEEN_PIECE);
			}
		}
		this._cursorRow = cellRow;
		this._cursorColumn = cellColumn;
		if (!(this._cellIsAlreadyHighlighted(this._cursorRow, this._cursorColumn))){
			this._drawer.drawCursor(cellRow, cellColumn, this._cursorColor);
		}
		this._setEventListeners();
	}

	_handleMouseDownEvent(cellRow, cellColumn){
		if (this._selectedCursorRow === null && this._selectedCursorColumn === null){
			if (this._boardRules.canSelectPiece(this._playerId, this._cursorRow, this._cursorColumn)){
				this._drawer.drawCursor(this._cursorRow, this._cursorColumn, cursorColors.SELECTED);
				this._selectedCursorRow = cellRow;
				this._selectedCursorColumn = cellColumn;
			}
			this._setEventListeners();
		}
		else{
			if (!this._inContinuousMoveMode && this._selectedCursorRow === cellRow &&
				this._selectedCursorColumn === cellColumn){
				this._drawer.drawCursor(cellRow, cellColumn, this._cursorColor);
				this._selectedCursorRow = null;
				this._selectedCursorColumn = null;
				this._setEventListeners();
			}
			else if (this._boardRules._canMove(this._playerId, this._selectedCursorRow, this._selectedCursorColumn,
				cellRow, cellColumn)){
				const fromRow = this._selectedCursorRow;
				const fromColumn = this._selectedCursorColumn;
				this._selectedCursorRow = null;
				this._selectedCursorColumn = null;
				this._postMoveFunc(this._playerId, fromRow, fromColumn, cellRow, cellColumn);
			}
			else{
				this._setEventListeners();
			}
		}
	}

	_cellIsAlreadyHighlighted(cellRow, cellColumn){
		if (this._selectedCursorRow === cellRow && this._selectedCursorColumn === cellColumn){
			return true;
		}
		return false;
	}

	static _transformCoordinateIntoCellNumber(toConvert){
	    return (Math.floor(toConvert / CELL_EDGE_SIZE));
	}

}