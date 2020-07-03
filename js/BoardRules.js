const moveTypes = {
    SIMPLE_MOVE: 1,
    JUMP_MOVE: 2
};

const moveOptions = {
    UP: 1,
    DOWN: 2
};

class BoardRules {

    static _isEmptyCell(boardArray, cellRow, cellColumn){
        return (boardArray[cellRow][cellColumn] === 0);
    }

    static canMove(boardArray, playerId, fromRow, fromColumn, toRow, toColumn){
        if ((toRow >= 0) && (toRow < ROWS_COLUMNS_NUM) && (toColumn >= 0) &&
            (toColumn < ROWS_COLUMNS_NUM) && (BoardRules._isEmptyCell(boardArray, toRow, toColumn))){
            const pieceType = (Math.abs(boardArray[fromRow][fromColumn]) === piecesTypes.SIMPLE_PIECE) ?
                piecesTypes.SIMPLE_PIECE : piecesTypes.QUEEN_PIECE;
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
                const opponentId = BoardRules.getOpponentId(playerId);
                return BoardRules._pieceBelongsToPlayer(boardArray, opponentId, middleRow, middleColumn);
            }
        }
        return false;
    }

    static canPerformAnotherMove(boardArray, playerId, fromRow, fromColumn, toRow, toColumn){
        if (Math.abs(toRow - fromRow) === 2 && Math.abs(toColumn - fromColumn) === 2){
            // Must be jump move in order to perform another move
            return BoardRules._pieceHasJumpMoves(boardArray, playerId, toRow, toColumn);
        }
    }

    static _playerHasMoves(boardArray, playerId){
        for (let i=0; i<ROWS_COLUMNS_NUM; i++){
            for (let j=0; j<ROWS_COLUMNS_NUM; j++){
                if (BoardRules._pieceBelongsToPlayer(boardArray, playerId, i, j) &&
                    BoardRules._pieceHasMoves(boardArray, playerId, i, j)){
                    return true;
                }
            }
        }
        return false;
    }

    static _pieceHasMoves(boardArray, playerId, pieceRow, pieceColumn){
        return BoardRules._pieceHasSimpleMoves(boardArray, playerId, pieceRow, pieceColumn) ||
            BoardRules._pieceHasJumpMoves(boardArray, playerId, pieceRow, pieceColumn);
    }

    static _pieceHasSimpleMoves(boardArray, playerId, pieceRow, pieceColumn){
        if (BoardRules._pieceBelongsToPlayer(boardArray, playerId, pieceRow, pieceColumn)) {
            return (
                BoardRules.canMove(boardArray, playerId, pieceRow, pieceColumn, pieceRow + 1, pieceColumn + 1) ||
                BoardRules.canMove(boardArray, playerId, pieceRow, pieceColumn, pieceRow + 1, pieceColumn - 1) ||
                BoardRules.canMove(boardArray, playerId, pieceRow, pieceColumn, pieceRow - 1, pieceColumn + 1) ||
                BoardRules.canMove(boardArray, playerId, pieceRow, pieceColumn, pieceRow - 1, pieceColumn - 1)
            );
        }
    }

    static _pieceHasJumpMoves(boardArray, playerId, pieceRow, pieceColumn){
        if (BoardRules._pieceBelongsToPlayer(boardArray, playerId, pieceRow, pieceColumn)) {
            return (
                BoardRules.canMove(boardArray, playerId, pieceRow, pieceColumn, pieceRow + 2, pieceColumn + 2) ||
                BoardRules.canMove(boardArray, playerId, pieceRow, pieceColumn, pieceRow + 2, pieceColumn - 2) ||
                BoardRules.canMove(boardArray, playerId, pieceRow, pieceColumn, pieceRow - 2, pieceColumn + 2) ||
                BoardRules.canMove(boardArray, playerId, pieceRow, pieceColumn, pieceRow - 2, pieceColumn - 2)
            );
        }
        return false;
    }

    static getPieceType(boardArray, row, column){
        if (Math.abs(boardArray[row][column]) === piecesTypes.SIMPLE_PIECE){
            return piecesTypes.SIMPLE_PIECE;
        }
        else if (Math.abs(boardArray[row][column]) === piecesTypes.QUEEN_PIECE){
            return piecesTypes.QUEEN_PIECE;
        }
        else{
            return null;
        }
    }

    static pieceIsQueen(boardArray, row, column){
        return (Math.abs(boardArray[row][column]) === piecesTypes.QUEEN_PIECE);
    }

    static pieceShouldBeConvertedToQueen(boardArray, row, column){
        return (column === 0 || column === ROWS_COLUMNS_NUM - 1 &&
            (Math.abs(boardArray[row][column]) === piecesTypes.SIMPLE_PIECE));
    }

    static isJumpMove(fromRow, fromColumn, toRow, toColumn){
        return (Math.abs(fromRow - toRow) === 2 && Math.abs(fromColumn - toColumn) === 2);
    }

    static getJumpedOverRowColumn(fromRowColumn, toRowColumn){
        return (fromRowColumn + toRowColumn) / 2
    }

    static applyContinuousMoveOnBoard(boardArray, move){
        while (move != null){
            BoardRules.applyMoveOnBoard(boardArray, move.fromRow, move.fromColumn, move.toRow, move.toColumn);
            move = move.nextMove;
        }
    }

    static applyMoveOnBoard(boardArray, fromRow, fromColumn, toRow, toColumn){
        boardArray[toRow][toColumn] = boardArray[fromRow][fromColumn];
        boardArray[fromRow][fromColumn] = 0;
        if (BoardRules.pieceShouldBeConvertedToQueen(boardArray, toRow, toColumn)){
            boardArray[toRow][toColumn] *= 2;
        }
        if (BoardRules.isJumpMove(fromRow, fromColumn, toRow, toColumn)){
            const opponentPieceRow = BoardRules.getJumpedOverRowColumn(fromRow, toRow);
            const opponentPieceColumn = BoardRules.getJumpedOverRowColumn(fromColumn, toColumn);
            boardArray[opponentPieceRow][opponentPieceColumn] = 0;
        }
    }

    static _pieceBelongsToPlayer(boardArray, playerId, cellRow, cellColumn){
        return ((boardArray[cellRow][cellColumn] * playerId) > 0);
    }

    static canSelectPiece(boardArray, playerId, cellRow, cellColumn){
        if (!(BoardRules._pieceBelongsToPlayer(boardArray, playerId, cellRow, cellColumn))){
            return false;
        }
        const allPossibleMoves = BoardRules.getAllPossibleMoves(boardArray, playerId);
        if (allPossibleMoves.length > 0){
            if (allPossibleMoves[0].moveType === moveTypes.SIMPLE_MOVE){
                return true;
            }
            else{
                for (let i=0; i<allPossibleMoves.length; i++){
                    if (allPossibleMoves[i].fromRow === cellRow && allPossibleMoves[i].fromColumn === cellColumn){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    static isGameEnded(boardArray, currentPlayerId){
        const opponentPlayerId = BoardRules.getOpponentId(currentPlayerId);
        return !(BoardRules._playerHasMoves(boardArray, opponentPlayerId));
    }

    static getOpponentId(playerId){
        return (playerId * -1);
    }

    static calcPlayerScore(boardArray, playerId){
        let score = 0;
        for (let i=0; i<ROWS_COLUMNS_NUM; i++){
            for (let j=0; j<ROWS_COLUMNS_NUM; j++){
                const fixedPieceScore = Math.abs(boardArray[i][j]);
                if ((boardArray[i][j] * playerId) > 0){
                    score += fixedPieceScore;
                }
                else if ((boardArray[i][j] * playerId) < 0){
                    score -= fixedPieceScore;
                }
            }
        }
        return score;
    }

    static getMoveOffset(moveOption, moveType){
        const unfixedMoveOffset = (moveType === moveTypes.SIMPLE_MOVE) ? 1 : 2;
        switch (moveOption){
            case moveOptions.UP:
                return unfixedMoveOffset;
            case moveOptions.DOWN:
                return -unfixedMoveOffset;
            default:
                return 0;
        }
    }

    static createCopyOfBoardArray(boardArray){
        const copyArray = [];
        for (let i=0; i<boardArray.length; i++){
            copyArray[i] = boardArray[i].slice();
        }
        return copyArray;
    }

    static addAllNestedMoves(boardArray, playerId, move, allPossibleMoves){
        const copiedArray = BoardRules.createCopyOfBoardArray(boardArray);
        BoardRules.applyMoveOnBoard(copiedArray, move.fromRow, move.fromColumn, move.toRow, move.toColumn);
        const allPossibleNextMoves = BoardRules.getAllPossibleMovesForPieceByMoveType(copiedArray, playerId, move.toRow,
            move.toColumn, moveTypes.JUMP_MOVE);
        if (allPossibleNextMoves.length === 0){
            allPossibleMoves.push(move.getRootParent());
        }
        else {
            for (let i = 0; i < allPossibleNextMoves.length; i++) {
                const copiedMove = move.getCopy();
                const nextMove = allPossibleNextMoves[i];
                copiedMove.nextMove = nextMove;
                nextMove.parent = copiedMove;
                BoardRules.addAllNestedMoves(copiedArray, playerId, nextMove, allPossibleMoves);
            }
        }
    }

    static getAllPossibleMovesForPieceByMoveType(boardArray, playerId, pieceRow, pieceColumn, moveType){
        const allPossibleMoves = [];
        for (let i=1; i<=2; i++){
            const toRow = pieceRow + BoardRules.getMoveOffset(i, moveType);
            for (let j=1; j<=2; j++){
                const toColumn = pieceColumn + BoardRules.getMoveOffset(j, moveType);
                if (BoardRules.canMove(boardArray, playerId, pieceRow, pieceColumn, toRow, toColumn)){
                    const move = new Move(pieceRow, pieceColumn, toRow, toColumn, moveType);
                    if (moveType === moveTypes.SIMPLE_MOVE){
                        allPossibleMoves.push(move);
                    }
                    else if (moveType === moveTypes.JUMP_MOVE){
                        BoardRules.addAllNestedMoves(boardArray, playerId, move, allPossibleMoves)
                    }
                }
            }
        }
        return allPossibleMoves;
    }

    static getAllPossibleMovesForPiece(boardArray, playerId, pieceRow, pieceColumn){
        const allPossibleJumpMoves = BoardRules.getAllPossibleMovesForPieceByMoveType(boardArray, playerId, pieceRow,
            pieceColumn, moveTypes.JUMP_MOVE);
        if (allPossibleJumpMoves.length === 0){
            return BoardRules.getAllPossibleMovesForPieceByMoveType(boardArray, playerId, pieceRow, pieceColumn,
                moveTypes.SIMPLE_MOVE);
        }
        return allPossibleJumpMoves;
    }

    static getFilteredMoves(allPossibleMoves){
        // In case there are jump move, the player must perform a jump and there is need to remove the simple moves
        const onlyJumpMoves = [];
        for (let i=0; i<allPossibleMoves.length; i++){
            if (allPossibleMoves[i].moveType === moveTypes.JUMP_MOVE){
                onlyJumpMoves.push(allPossibleMoves[i]);
            }
        }
        if (onlyJumpMoves.length > 0){
            return onlyJumpMoves;
        }
        else{
            return allPossibleMoves;
        }
    }

    static shuffleArray(arr){
        let i, j, x;
        for (i = arr.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = arr[i - 1];
            arr[i - 1] = arr[j];
            arr[j] = x;
        }
    }

    static getAllPossibleMoves(boardArray, playerId){
        let allPossibleMoves = [];
        for (let i=0; i<ROWS_COLUMNS_NUM; i++){
            for (let j=0; j<ROWS_COLUMNS_NUM; j++){
                if (BoardRules._pieceBelongsToPlayer(boardArray, playerId, i, j)){
                    const pieceMoves = BoardRules.getAllPossibleMovesForPiece(boardArray, playerId, i, j);
                    allPossibleMoves = allPossibleMoves.concat(pieceMoves);
                }
            }
        }
        const filteredMoves = BoardRules.getFilteredMoves(allPossibleMoves);
        BoardRules.shuffleArray(filteredMoves);
        return filteredMoves;
    }

    static getAllOpponentPiecesForJump(boardArray, playerId){
        const res = [];
        const allPossibleMoves = BoardRules.getAllPossibleMoves(boardArray, playerId);
        if (allPossibleMoves.length > 0 && allPossibleMoves[0].moveType === moveTypes.JUMP_MOVE){
            allPossibleMoves.forEach((possibleMove) => {
                const opponentPieceRow = BoardRules.getJumpedOverRowColumn(possibleMove.fromRow, possibleMove.toRow);
                const opponentPieceColumn = BoardRules.getJumpedOverRowColumn(possibleMove.fromColumn,
                    possibleMove.toColumn);
                res.push([opponentPieceRow, opponentPieceColumn]);
            });
        }
        return res;
    }

}