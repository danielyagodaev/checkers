class Move {

    constructor(fromRow, fromColumn, toRow, toColumn, moveType) {
        this._fromRow = fromRow;
        this._fromColumn = fromColumn;
        this._toRow = toRow;
        this._toColumn = toColumn;
        this._moveType = moveType;
        this._nextMove = null;
        this._parent = null;
    }

    get fromRow(){
        return this._fromRow;
    }

    get fromColumn(){
        return this._fromColumn;
    }

    get toRow(){
        return this._toRow;
    }

    get toColumn(){
        return this._toColumn;
    }

    get moveType(){
        return this._moveType;
    }

    get nextMove(){
        return this._nextMove;
    }

    get parent(){
        return this._parent;
    }

    set nextMove(move){
        this._nextMove = move;
    }

    set parent(parent){
        this._parent = parent;
    }

    getRootParent(){
        if (this._parent === null){
            return this;
        }
        else{
            return this._parent.getRootParent();
        }
    }

    getCopy(){
       const copiedMove = new Move(this._fromRow, this._fromColumn, this._toRow, this._toColumn, this._moveType);
       copiedMove._nextMove = this._nextMove;
       copiedMove._parent = this._parent;
       return copiedMove;
    }
}