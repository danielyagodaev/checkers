const playersColors = {
	RED: "Red",
	WHITE: "White"
};

class Drawer {

	constructor(boardContext, boardRowsColumns, cellEdgeSize, pieceRadius){
		this._boardContext = boardContext;
		this._boardRowsColumns = boardRowsColumns;
		this._cellEdgeSize = cellEdgeSize;
		this._pieceRadius = pieceRadius;
	}

	drawBoard() {
		for (let i=0; i<this._boardRowsColumns; i++){
			for (let j=0; j<this._boardRowsColumns; j++){
				this._drawSingleSquare(i,j);
			}
		}
	}

	_drawSingleSquare(cellRow, cellColumn) {
		const squareWithoutPieceFirstColor = "#a4aeb8";
		const squareWithoutPieceSecondColor = "#b1b9c2";
		const squareWithPieceFirstColor = "#515d68" ;
		const squareWithPieceSecondColor = "#5b6875";
		const boardX = cellRow * this._cellEdgeSize;
		const boardY = cellColumn * this._cellEdgeSize;
		let firstColor, secondColor, gradient;
		if ((cellRow % 2) === (cellColumn % 2)){
			gradient = this._boardContext.createLinearGradient(boardX, boardY+(this._cellEdgeSize/2),
				boardX+this._cellEdgeSize, boardY+(this._cellEdgeSize/2));
			firstColor = squareWithoutPieceFirstColor;
			secondColor = squareWithoutPieceSecondColor;
		}
		else {
			gradient = this._boardContext.createLinearGradient(boardX+(this._cellEdgeSize/2), boardY,
				boardX+(this._cellEdgeSize/2), boardY+this._cellEdgeSize);
			firstColor = squareWithPieceFirstColor;
			secondColor = squareWithPieceSecondColor;
		}
		let currentColor, colorStopSum = 0;
		const colorStops = 20;
		for (let k=0; k<colorStops; k++){
			currentColor = ((k % 2) === 0) ? firstColor : secondColor;
			gradient.addColorStop(colorStopSum, currentColor);
			colorStopSum += (1 / colorStops);
		}
		this._boardContext.fillStyle = gradient;
	    this._boardContext.fillRect(boardX, boardY, this._cellEdgeSize, this._cellEdgeSize);
	}

	drawCursor(cellRow, cellColumn, cursorColor){
		const boardX = cellRow * this._cellEdgeSize;
		const boardY = cellColumn * this._cellEdgeSize;
		const cursorSize = 5;
		this._boardContext.fillStyle = cursorColor;
	    this._boardContext.fillRect(boardX, boardY, cursorSize, this._cellEdgeSize);
	    this._boardContext.fillRect(boardX, boardY, this._cellEdgeSize, cursorSize);
	    this._boardContext.fillRect(boardX + this._cellEdgeSize - cursorSize, boardY, cursorSize, this._cellEdgeSize);
	    this._boardContext.fillRect(boardX, boardY + this._cellEdgeSize - cursorSize, this._cellEdgeSize, cursorSize);
	}

	removeCursor(cellRow, cellColumn){
		this._drawSingleSquare(cellRow, cellColumn);
	}

	drawPiece(playerColor, boardX, boardY, addQueenSymbol) {
		let pieceFirstColor, pieceSecondColor, queenColor;
		if (playerColor === playersColors.RED){
			pieceFirstColor = "#800000";
			pieceSecondColor = "#a24545";
			queenColor = "#000000";
		}
		else {
			pieceFirstColor = "#b2b2a0";
			pieceSecondColor = "#dedec8";
			queenColor = "#404040";
		}
		this._drawSimplePiece(pieceFirstColor, pieceSecondColor, boardX, boardY);
		if (addQueenSymbol){
			this._drawQueenSymbol(queenColor, boardX, boardY);
		}
	}

	_drawSimplePiece(pieceFirstColor, pieceSecondColor, boardX, boardY){
		this._boardContext.beginPath();
		this._boardContext.arc(boardX, boardY, this._pieceRadius, 0, 2*Math.PI);
        const pieceGradient = this._boardContext.createRadialGradient(boardX - this._pieceRadius,
			boardY - this._pieceRadius, 0, boardX - this._pieceRadius, boardY - this._pieceRadius, this._cellEdgeSize);
        pieceGradient.addColorStop(0, pieceFirstColor);
        pieceGradient.addColorStop(0.8, pieceFirstColor);
        pieceGradient.addColorStop(1, pieceSecondColor);
		this._boardContext.shadowColor = 'black';
		this._boardContext.shadowBlur = 1;
		this._boardContext.shadowOffsetX = 0;
		this._boardContext.shadowOffsetY = 0;
		this._boardContext.fillStyle = pieceGradient;
		this._boardContext.lineWidth = 1;
		this._boardContext.strokeStyle = 'black';
		this._boardContext.fill();
		this._boardContext.stroke();
		this._boardContext.closePath();
	}

	_drawQueenSymbol(queenColor, boardX, boardY){
	    this._boardContext.beginPath();
        this._boardContext.moveTo(boardX - 12, boardY + 7);
        this._boardContext.lineTo(boardX - 17, boardY - 7) ;
        this._boardContext.bezierCurveTo(boardX - 17, boardY, boardX, boardY, boardX, boardY - 12);
        this._boardContext.bezierCurveTo(boardX, boardY, boardX + 17, boardY, boardX + 17, boardY - 7);
        this._boardContext.lineTo(boardX + 12, boardY + 7);
        this._boardContext.lineTo(boardX - 12, boardY + 7);
        this._boardContext.fillStyle = queenColor;
        this._boardContext.fill();
        this._boardContext.closePath();

        this._boardContext.beginPath();
        this._boardContext.rect(boardX - 12, boardY + 9, 24, 4);
        this._boardContext.fillStyle = queenColor;
        this._boardContext.fill();
        this._boardContext.closePath();

        this._boardContext.beginPath();
        this._boardContext.arc(boardX - 17, boardY - 7, 2, 0, 2*Math.PI);
        this._boardContext.fillStyle = queenColor;
        this._boardContext.fill();
        this._boardContext.closePath();

        this._boardContext.beginPath();
        this._boardContext.arc(boardX, boardY - 12, 2, 0, 2*Math.PI);
        this._boardContext.fillStyle = queenColor;
        this._boardContext.fill();
        this._boardContext.closePath();

        this._boardContext.beginPath();
        this._boardContext.arc(boardX + 17, boardY - 7, 2, 0, 2*Math.PI);
        this._boardContext.fillStyle = queenColor;
        this._boardContext.fill();
        this._boardContext.closePath();
	}


}