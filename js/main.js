window.onload = function() {
	const player1Name = getParameterByName("player_1_name");
	const player2Name = getParameterByName("player_2_name");
	const player1Color = getParameterByName("player_1_color");
	const startingColor = getParameterByName("starting_color");
	const player2Type = getParameterByName("player_2_type");
	const computerLevel = getParameterByName("computer_level");
	const sounds = getParameterByName("sounds") === "on";
	const highlight_jumps = getParameterByName("highlight_jumps") === "yes";

	const player2Color = (player1Color === playersColors.RED) ? playersColors.WHITE : playersColors.RED;
	showPlayersDetails(player1Name, player1Color, player2Name, player2Color);

	const board = new Board(player1Color, player2Type, player2Color, startingColor,
		computerLevel, sounds, highlight_jumps);
	board.play();
}

function getParameterByName(name, url) {
    if (!url){
    	url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results){
    	return null;
    }
    if (!results[2]){
    	return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function showPlayersDetails(player1Name, player1Color, player2Name, player2Color){
	const player1NameElement = document.getElementById("player_1_name_label");
	player1NameElement.innerText = player1Name;
	const player1ColorElement = document.getElementById("player_1_color_label");
	player1ColorElement.innerText = player1Color;
	const player2NameElement = document.getElementById("player_2_name_label");
	player2NameElement.innerText = player2Name;
	const player2ColorElement = document.getElementById("player_2_color_label");
	player2ColorElement.innerText = player2Color;
}