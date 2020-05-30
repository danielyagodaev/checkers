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

let boardRowsColumns, squareEdgeSize;
let boardElement, boardContext;
let player1Name, player2Name;
let player1Color, player2Color, startingColor;
let player2Type, computerLevel, sounds, showJumps;
let currentPlayerTurn = null;
let player1, player2, currentPlayer = null;

let cursorMoveRow, cursorMoveColumn;
let gameBoard, drawer;

const moveEffectTotalTime = 300;
const moveEffectIterations = 10;

window.onload = function() {
	getAllInputParameters();
	initVariables();
	showPlayersDetails();
	startGame();
}

function initVariables() {
	boardElement = document.getElementById("board");
    boardContext = boardElement.getContext("2d");
    squareEdgeSize = Math.min(boardElement.height, boardElement.width) / boardArray.length;
    boardRowsColumns = boardArray.length;
    player2Color = (player1Color === playersColors.RED) ? playersColors.WHITE : playersColors.RED;

    drawer = new Drawer(boardContext, boardRowsColumns, squareEdgeSize, 40);
    gameBoard = new Board(boardArray);
    gameBoard.initPieces(player1Color, player2Color, squareEdgeSize);

    player1 = new HumanPlayer(playerIdentifiers.PLAYER_1 ,gameBoard, boardElement, player1Color, "yellow", drawer, performMove);
    player2 = new HumanPlayer(playerIdentifiers.PLAYER_2, gameBoard, boardElement, player2Color, "blue", drawer, performMove);
}

function getAllInputParameters(){
	player1Name = getParameterByName("player_1_name");
    player2Name = getParameterByName("player_2_name");
    player1Color = getParameterByName("player_1_color");
    startingColor = getParameterByName("starting_color");
    player2Type = getParameterByName("player_2_type");
    computerLevel = getParameterByName("computer_level");
    showJumps = getParameterByName("highlight_jumps");
    sounds = getParameterByName("sounds");
}

function getParameterByName(name, url) {
    if (!url){
    	url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results){
    	return null;
    }
    if (!results[2]){
    	return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function showPlayersDetails(){
	const player1NameElement = document.getElementById("player_1_name_label");
	player1NameElement.innerText = player1Name;
	const player1ColorElement = document.getElementById("player_1_color_label");
	player1ColorElement.innerText = player1Color;
	const player2NameElement = document.getElementById("player_2_name_label");
	player2NameElement.innerText = player2Name;
	const player2ColorElement = document.getElementById("player_2_color_label");
	player2ColorElement.innerText = player2Color;

}


function drawGame() {
	drawer.drawBoard();
	for (const [pieceId, piece] of gameBoard.piecesMap){
		drawer.drawPiece(piece.playerColor, piece.boardX, piece.boardY, piece.pieceType === piecesTypes.QUEEN_PIECE);
	}
}

function startGame() {
	drawGame();
	moveToNextPlayer();
}

function moveToNextPlayer(){
	if (currentPlayer === null){
		if ((player1Color === playersColors.RED && startingColor === playersColors.RED) ||
			(player1Color === playersColors.WHITE && startingColor === playersColors.WHITE)){
			currentPlayer = player1;
		}
		else{
			currentPlayer = player2;
		}
	}
	else{
		currentPlayer = (currentPlayer === player1) ? player2 : player1;
	}
	currentPlayer.play();
}

function performMove(fromRow, fromColumn, toRow, toColumn){
	console.log("performing move");
	const piece = gameBoard.getPiece(fromRow, fromColumn);
	const moveEffectSingleIterationTime = moveEffectTotalTime/moveEffectIterations;
	const xDelta = ((toRow - fromRow) * squareEdgeSize) / moveEffectIterations;
    const yDelta = ((toColumn - fromColumn) * squareEdgeSize) / moveEffectIterations;
	for (let i=0; i<moveEffectIterations; i++){
		setTimeout(()=>{
			piece.boardX += xDelta;
			piece.boardY += yDelta;
			drawGame();
		}, i*moveEffectSingleIterationTime);
	}
	setTimeout(()=>{
		postMoveAction(fromRow, fromColumn, toRow, toColumn);
	}, moveEffectTotalTime)


}

function postMoveAction(fromRow, fromColumn, toRow, toColumn){
	boardArray[toRow][toColumn] = boardArray[fromRow][fromColumn];
	boardArray[fromRow][fromColumn] = 0;
	if (gameBoard.isGameEnded()){
		endGame();
	}
	else{
		moveToNextPlayer();
	}
}

function endGame(){
	// TODO
}