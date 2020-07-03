const playerIds = {
    PLAYER_1: 1,
    PLAYER_2: -1
};

class Player {

    constructor(boardArray, playerId, postMoveFunc){
        this._boardArray = boardArray;
        this._playerId = playerId;
        this._postMoveFunc = postMoveFunc;
        this._inContinuousMoveMode = false;
    }

    get playerId(){
        return this._playerId;
    }

    set inContinuousMoveMode(inContinuousMoveMode){
        this._inContinuousMoveMode = inContinuousMoveMode;
    }

    play(){
        return null;
    }
}