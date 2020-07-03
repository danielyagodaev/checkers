const soundOptions = {
    PIECE_MOVE: 1,
    ERROR_MOVE: 2,
    WINNER: 3,
    LOOSER: 4
}

class SoundsManager {

    static playSound(option){
        let soundFile = null;
        switch(option){
            case soundOptions.PIECE_MOVE:
                soundFile = "piece_movement.wav";
                break;
            case soundOptions.ERROR_MOVE:
                soundFile = "error.wav";
                break;
            case soundOptions.WINNER:
                soundFile = "game_winner.wav";
                break;
            case soundOptions.LOOSER:
                soundFile = "game_over.wav";
                break;
            default:
                break;
        }
        if (soundFile){
            const audio = new Audio("../sounds/" + soundFile);
            audio.play();
        }
    }
}