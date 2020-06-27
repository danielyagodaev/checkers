const BAD_SCORE = -50;

class ScoreNode {

    constructor(boardArray, playerId, depth, move) {
        this._boardArray = boardArray;
        this._playerId = playerId;
        this._depth = depth;
        this._move = move;
        this._score = BAD_SCORE;
        this._subNodes = [];
    }

    get boardArray(){
        return this._boardArray;
    }

    get playerId(){
        return this._playerId;
    }

    get depth(){
        return this._depth;
    }

    get move(){
        return this._move;
    }

    get score(){
        return this._score;
    }

    get subNodes(){
        return this._subNodes;
    }

    set move(move){
        this._move = move;
    }

    set score(score){
        this._score = score;
    }

    addSubNode(toAdd){
        this._subNodes.push(toAdd);
    }

}