const computerLevels = {
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard"
};

class ComputerPlayer extends Player {

    constructor(boardArray, playerId, postMoveFunc, computerLevel) {
        super(boardArray, playerId, postMoveFunc);
        this._computerLevel = computerLevel;
        this._currentMove = null;
    }

    play() {
        let nextMove;
        if (this._inContinuousMoveMode) {
            nextMove = this._currentMove.nextMove;
        } else {
            nextMove = ComputerPlayer._findBestMove(this._boardArray, this._playerId, this._computerLevel);
        }
        this._currentMove = nextMove;
        this._postMoveFunc(this._playerId, nextMove.fromRow, nextMove.fromColumn, nextMove.toRow, nextMove.toColumn);
    }

    static _getScoreTreeDepth(computerLevel){
        switch (computerLevel){
            case computerLevels.EASY:
                return 1;
            case computerLevels.MEDIUM:
                return 3;
            case computerLevels.HARD:
                return 5;
            default:
                return 0;
        }
    }

    static _getPlayerIdByDepth(playerId, depth){
        return (depth % 2 === 0) ? playerId : BoardRules.getOpponentId(playerId);
    }

    static _buildScoreTree(boardArray, playerId, treeDepth){
        if (treeDepth > 0){
            const rootScoreNode = new ScoreNode(boardArray, playerId, 0, null);
            ComputerPlayer._buildScoreTreeHelper(boardArray, playerId, treeDepth, rootScoreNode);
            return rootScoreNode;
        }
        else{
            return null;
        }
    }

    static _buildScoreTreeHelper(boardArray, playerId, treeDepth, currentNode){
        if (currentNode.depth < treeDepth){
            const currentPlayerId = ComputerPlayer._getPlayerIdByDepth(playerId, currentNode.depth);
            const allPossibleMoves = BoardRules.getAllPossibleMoves(boardArray, currentPlayerId);
            allPossibleMoves.forEach((possibleMove)=>{
               const copiedArray = BoardRules.createCopyOfBoardArray(boardArray);
               BoardRules.applyContinuousMoveOnBoard(copiedArray, possibleMove);
               const tempScoreNode = new ScoreNode(copiedArray, playerId, currentNode.depth+1, possibleMove);
                ComputerPlayer._buildScoreTreeHelper(copiedArray, playerId, treeDepth, tempScoreNode);
                currentNode.addSubNode(tempScoreNode);
            });
        }
    }

    static _findBestMove(boardArray, playerId, computerLevel){
        const treeDepth = ComputerPlayer._getScoreTreeDepth(computerLevel);
        const scoreTree = ComputerPlayer._buildScoreTree(boardArray, playerId, treeDepth);
        ComputerPlayer._calcScoreForEachNode(scoreTree);
        const subNodes = scoreTree.subNodes;
        for (let i=0; i<subNodes.length; i++){
            if (subNodes[i].score === scoreTree.score){
                return subNodes[i].move;
            }
        }
        return null;
    }

    static _calcScoreForEachNode(currentScoreNode){
        if (currentScoreNode.subNodes.length === 0){
            // Leaf
            currentScoreNode.score = BoardRules.calcPlayerScore(currentScoreNode.boardArray, currentScoreNode.playerId);
        }
        else{
            const currentDepthSign = (currentScoreNode.depth % 2 === 0) ? -1 : 1;
            const subNodes = currentScoreNode.subNodes;
            let miniMaxScore = currentDepthSign * 50;
            subNodes.forEach((subNode)=>{
                ComputerPlayer._calcScoreForEachNode(subNode);
                if ((currentDepthSign < 0 && subNode.score > miniMaxScore) ||
                    (currentDepthSign > 0 && subNode.score < miniMaxScore)){
                    // When @currentDepthSign is negative, we are looking for the best move of the original player
                    // Otherwise, we are looking for the best move of the opponent player
                    miniMaxScore = subNode.score;
                }
            })
            currentScoreNode.score = miniMaxScore;
        }
    }
}