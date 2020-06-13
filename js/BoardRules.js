class BoardRules {

    constructor(boardArray, piecesMap) {
        this._boardArray = boardArray;
        this._piecesMap = piecesMap;
    }

    _isEmptyCell(cellRow, cellColumn){
        return (this._boardArray[cellRow][cellColumn] === 0);
    }

    _canMove(playerId, fromRow, fromColumn, toRow, toColumn){
        if ((toRow >= 0) && (toRow < this._boardArray.length) && (toColumn >= 0) &&
            (toColumn < this._boardArray[toRow].length) && (this._isEmptyCell(toRow, toColumn))){
            const playerPiece = this.getPiece(fromRow, fromColumn);
            const pieceType = playerPiece.pieceType;
            let columnDelta;
            if (pieceType === piecesTypes.SIMPLE_PIECE && playerId === playerIds.PLAYER_1){
                columnDelta = fromColumn - toColumn;
            }
            else{
                columnDelta = toColumn - fromColumn;
            }
            const rowDelta = Math.abs(toRow - fromRow);
            if (rowDelta !== Math.abs(columnDelta)){
                return false;
            }
            if (columnDelta === 1 || (columnDelta === -1 && pieceType === piecesTypes.QUEEN_PIECE)){
                return true;
            }
            else if (columnDelta === 2 || (columnDelta === -2 && pieceType === piecesTypes.QUEEN_PIECE)){
                const middleRow = (fromRow + toRow) / 2;
                const middleColumn = (fromColumn + toColumn) / 2;
                const opponentId = this._getOpponentId(playerId);
                return this._pieceBelongsToPlayer(opponentId, middleRow, middleColumn);
            }
        }
        return false;
    }

    canPerformAnotherMove(playerId, fromRow, fromColumn, toRow, toColumn){
        if (Math.abs(toRow - fromRow) === 2 && Math.abs(toColumn - fromColumn) === 2){
            // Must be jump move in order to perform another move
            return this._pieceHasJumpMoves(playerId, toRow, toColumn);
        }
    }

    _playerHasMoves(playerId){
        for (let i=0; i<ROWS_COLUMNS_NUM; i++){
            for (let j=0; j<ROWS_COLUMNS_NUM; j++){
                if (this._pieceBelongsToPlayer(playerId, i, j) && this._pieceHasMoves(playerId, i, j)){
                    return true;
                }
            }
        }
        return false;
    }

    _pieceHasMoves(playerId, pieceRow, pieceColumn){
        return this._pieceHasSimpleMoves(playerId, pieceRow, pieceColumn) ||
            this._pieceHasJumpMoves(playerId, pieceRow, pieceColumn);
    }

    _pieceHasSimpleMoves(playerId, pieceRow, pieceColumn){
        if (this._pieceBelongsToPlayer(playerId, pieceRow, pieceColumn)) {
            return (
                this._canMove(playerId, pieceRow, pieceColumn, pieceRow + 1, pieceColumn + 1) ||
                this._canMove(playerId, pieceRow, pieceColumn, pieceRow + 1, pieceColumn - 1) ||
                this._canMove(playerId, pieceRow, pieceColumn, pieceRow - 1, pieceColumn + 1) ||
                this._canMove(playerId, pieceRow, pieceColumn, pieceRow - 1, pieceColumn - 1)
            );
        }
    }

    _pieceHasJumpMoves(playerId, pieceRow, pieceColumn){
        if (this._pieceBelongsToPlayer(playerId, pieceRow, pieceColumn)) {
            return (
                this._canMove(playerId, pieceRow, pieceColumn, pieceRow + 2, pieceColumn + 2) ||
                this._canMove(playerId, pieceRow, pieceColumn, pieceRow + 2, pieceColumn - 2) ||
                this._canMove(playerId, pieceRow, pieceColumn, pieceRow - 2, pieceColumn + 2) ||
                this._canMove(playerId, pieceRow, pieceColumn, pieceRow - 2, pieceColumn - 2)
            );
        }
        return false;
    }

    applyMoveOnBoard(fromRow, fromColumn, toRow, toColumn){
        this._boardArray[toRow][toColumn] = this._boardArray[fromRow][fromColumn];
        this._boardArray[fromRow][fromColumn] = 0;
        const playerPiece = this.getPiece(toRow, toColumn);
        if ((toColumn === 0 || toColumn === ROWS_COLUMNS_NUM-1) &&
            playerPiece.pieceType === piecesTypes.SIMPLE_PIECE){
            playerPiece.changePieceTypeToQueen();
        }
        if (Math.abs(fromRow - toRow) === 2 && Math.abs(fromColumn - toColumn) === 2){
            // Jump move
            const opponentPieceRow = (fromRow + toRow) / 2;
            const opponentPieceColumn = (fromColumn + toColumn) / 2;
            const opponentPiece = this.getPiece(opponentPieceRow, opponentPieceColumn);
            this._deletePiece(opponentPiece);
            this._boardArray[opponentPieceRow][opponentPieceColumn] = 0;
        }
    }

    _pieceBelongsToPlayer(playerId, cellRow, cellColumn){
        return ((this._boardArray[cellRow][cellColumn] * playerId) > 0);
    }

    canSelectPiece(playerId, cellRow, cellColumn){
        return this._pieceBelongsToPlayer(playerId, cellRow, cellColumn);
    }

    getPiece(cellRow, cellColumn){
        if (this._hasPiece(cellRow, cellColumn)){
            for (const [pieceId, piece] of this._piecesMap){
                const boardX = piece.boardX;
                const boardY = piece.boardY;
                const boardRow = Math.floor(boardX / CELL_EDGE_SIZE);
                const boardColumn = Math.floor(boardY / CELL_EDGE_SIZE);
                if (cellRow === boardRow && cellColumn === boardColumn){
                    return piece;
                }
            }
        }
        else{
            return null;
        }
    }

    _hasPiece(cellRow, cellColumn){
        return (this._boardArray[cellRow][cellColumn] !== 0);
    }

    _deletePiece(pieceToDelete){
        for (const [pieceId, piece] of this._piecesMap){
            if (piece === pieceToDelete){
                this._piecesMap.delete(pieceId);
                return true;
            }
        }
        return false;
    }

    isGameEnded(currentPlayerId){
        const opponentPlayerId = this._getOpponentId(currentPlayerId);
        return !(this._playerHasMoves(opponentPlayerId));
    }

    _getOpponentId(playerId){
        return (playerId * -1);
    }
}