class PiecesManager {

    constructor() {
        this._pieces = new Map();
        this._piecesCount = 0;
    }

    getAllPieces() {
        return Array.from(this._pieces.values());
    }


    createAndAddNewPiece(playerColor, row, column){
        const boardX = PiecesManager._getCoordinateOnBoard(row);
        const boardY = PiecesManager._getCoordinateOnBoard(column);
        const piece = new Piece(this._piecesCount, playerColor, boardX, boardY);
        this._pieces.set(this._piecesCount++, piece);
    }

    hasPiece(row, column){
        return (this.getPiece(row, column) !== null);
    }

    getPiece(row, column){
        const boardX = PiecesManager._getCoordinateOnBoard(row);
        const boardY = PiecesManager._getCoordinateOnBoard(column);
        for (const [pieceId, piece] of this._pieces){
            if (piece.boardX === boardX && piece.boardY === boardY){
                return piece;
            }
        }
        return null;
    }

    deletePiece(row, column){
        const piece = this.getPiece(row, column);
        if (piece !== null){
            this._pieces.delete(piece.pieceId);
            this._piecesCount--;
        }
    }

    static _getCoordinateOnBoard(x){
        return (x * CELL_EDGE_SIZE) + (0.5 * CELL_EDGE_SIZE);
    }

}