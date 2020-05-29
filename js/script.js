const boardArray = [
[0,-1,0,0,0,1,0,1],
[-1,0,-1,0,0,0,1,0],
[0,-1,0,0,0,1,0,1],
[-1,0,-1,0,0,0,1,0],
[0,-1,0,0,0,1,0,1],
[-1,0,-1,0,0,0,1,0],
[0,-1,0,0,0,1,0,1],
[-1,0,-1,0,0,0,1,0]
];

const playerIdentifiers = {
	PLAYER_1: 1,
	PLAYER_2: -1
};

const piecesTypes = {
	SIMPLE_PIECE: 1,
	QUEEN_PIECE: 2
};

const playersColors = {
	RED: "red",
	WHITE: "white"
};

const piecesMap = new Map();

let squareSize;
let board, boardContext;

window.onload = function() {
	initVariables();
	drawGame();
	startGame();
}

function initVariables() {
	board = document.getElementById("board");
    boardContext = board.getContext("2d");
    squareSize = Math.min(board.height, board.width) / boardArray.length;
    initPieces();
}

function initPieces() {
	let piecesCount = 0;
	for (let i=0; i<boardArray.length; i++){
		for (let j=0; j<boardArray[0].length; j++){
			if (boardArray[i][j] !== 0){
				const pieceId = piecesCount++;
				const boardX = getCoordinateOnBoard(i);
				const boardY = getCoordinateOnBoard(j);
				const playerColor = (boardArray[i][j] === playerIdentifiers.PLAYER_1) ? playersColors.RED : playersColors.WHITE;
				const piece = new Piece(playerColor, boardX, boardY);
				piecesMap.set(pieceId, piece);
			}
		}
	}
}

function getCoordinateOnBoard(x){
	return (x * squareSize) + (0.5 * squareSize);
}

function drawGame() {
	drawBoard();
	drawPieces();
}

function drawBoard() {
	for (let i=0; i<boardArray.length; i++){
		for (let j=0; j<boardArray[0].length; j++){
			drawSingleSquare(i,j);
		}
	}
}

function drawSingleSquare(i,j) {
	const squareWithoutPieceFirstColor = "#a4aeb8";
	const squareWithoutPieceSecondColor = "#b1b9c2";
	const squareWithPieceFirstColor = "#515d68" ;
	const squareWithPieceSecondColor = "#5b6875";
	const boardX = i * squareSize;
	const boardY = j * squareSize;
	let firstColor, secondColor, gradient;
	if ((i % 2) === (j % 2)){
		gradient = boardContext.createLinearGradient(boardX, boardY+(squareSize/2), boardX+squareSize, boardY+(squareSize/2));
		firstColor = squareWithoutPieceFirstColor;
		secondColor = squareWithoutPieceSecondColor;
	}
	else {
		gradient = boardContext.createLinearGradient(boardX+(squareSize/2), boardY, boardX+(squareSize/2), boardY+squareSize);
		firstColor = squareWithPieceFirstColor;
		secondColor = squareWithPieceSecondColor;
	}
	let currentColor, colorStopSum = 0;
	const colorStops = 10;
	for (let k=0; k<colorStops; k++){
		currentColor = ((k % 2) === 0) ? firstColor : secondColor;
		gradient.addColorStop(colorStopSum, currentColor);
		colorStopSum += (1 / colorStops);
	}
	boardContext.fillStyle = gradient;
    boardContext.fillRect(boardX, boardY, squareSize, squareSize);
}

function drawPieces() {
	for (const [pieceId, piece] of piecesMap){
		piece.drawPiece();
	}
}

function startGame() {

}

class Piece {

	constructor(playerColor, boardX, boardY){
		this.playerColor = playerColor;
		this.boardX = boardX;
		this.boardY = boardY;
		this.pieceType = piecesTypes.SIMPLE_PIECE;
	}

	static _getPieceRadius(){
		return 40;
	}

	drawPiece(){
		let pieceFirstColor, pieceSecondColor, queenColor;
		if (this.playerColor === playersColors.RED){
			pieceFirstColor = "#800000";
			pieceSecondColor = "#a24545";
			queenColor = "#000000";
		}
		else {
			pieceFirstColor = "#b2b2a0";
			pieceSecondColor = "#dedec8";
			queenColor = "#404040";
		}
		const pieceRadius = Piece._getPieceRadius();
		this._drawCircle(pieceFirstColor, pieceSecondColor, pieceRadius);
		if (this.pieceType === piecesTypes.QUEEN_PIECE){
			this._addQueenSymbol(queenColor);
		}
	}

	_drawCircle(pieceFirstColor, pieceSecondColor, radius){
        boardContext.beginPath();
        boardContext.arc(this.boardX, this.boardY, radius, 0, 2*Math.PI);
        const pieceGradient = boardContext.createRadialGradient(this.boardX - radius, this.boardY - radius, 0, this.boardX - radius, this.boardY - radius, squareSize);
        pieceGradient.addColorStop(0, pieceFirstColor);
        pieceGradient.addColorStop(0.8, pieceFirstColor);
        pieceGradient.addColorStop(1, pieceSecondColor);
        boardContext.shadowColor = 'black';
        boardContext.shadowBlur = 1;
        boardContext.shadowOffsetX = 0;
        boardContext.shadowOffsetY = 0;
        boardContext.fillStyle = pieceGradient;
        boardContext.lineWidth = 1;
        boardContext.strokeStyle = 'black';
        boardContext.fill();
        boardContext.stroke();
        boardContext.closePath();
	}

	_addQueenSymbol(queenColor){
	    boardContext.beginPath();
        boardContext.moveTo(this.boardX - 12, this.boardY + 7);
        boardContext.lineTo(this.boardX - 17, this.boardY - 7) ;
        boardContext.bezierCurveTo(this.boardX - 17, this.boardY, this.boardX, this.boardY, this.boardX, this.boardY - 12);
        boardContext.bezierCurveTo(this.boardX, this.boardY, this.boardX + 17, this.boardY, this.boardX + 17, this.boardY - 7);
        boardContext.lineTo(this.boardX + 12, this.boardY + 7);
        boardContext.lineTo(this.boardX - 12, this.boardY + 7);
        boardContext.fillStyle = queenColor;
        boardContext.fill();
        boardContext.closePath();

        boardContext.beginPath();
        boardContext.rect(this.boardX - 12, this.boardY + 9, 24, 4);
        boardContext.fillStyle = queenColor;
        boardContext.fill();
        boardContext.closePath();

        boardContext.beginPath();
        boardContext.arc(this.boardX - 17, this.boardY - 7, 2, 0, 2*Math.PI);
        boardContext.fillStyle = queenColor;
        boardContext.fill();
        boardContext.closePath();

        boardContext.beginPath();
        boardContext.arc(this.boardX, this.boardY - 12, 2, 0, 2*Math.PI);
        boardContext.fillStyle = queenColor;
        boardContext.fill();
        boardContext.closePath();

        boardContext.beginPath();
        boardContext.arc(this.boardX + 17, this.boardY - 7, 2, 0, 2*Math.PI);
        boardContext.fillStyle = queenColor;
        boardContext.fill();
        boardContext.closePath();
	}


}