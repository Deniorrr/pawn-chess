const findLegalMoves = require("./findLegalMoves");
const isBlackChecked = require("./isBlackChecked");
const isWhiteChecked = require("./isWhiteChecked");

const checkEndGameConditions = (board, isWhiteTurn) => {
  const currentTurn = isWhiteTurn ? "white" : "black";
  if (isMaterialDraw(board))
    return { gameOver: true, winner: "none", winType: "material" };

  return isCheckmateOrStalemate(board, currentTurn);
};

const isMaterialDraw = (_board) => {
  const whitePieces = _board
    .flat()
    .filter((piece) => "PK".includes(piece)).length;
  const blackPieces = _board
    .flat()
    .filter((piece) => "pk".includes(piece)).length;
  if (whitePieces === 1 && blackPieces === 1) return true;
  return false;
  //onGameOver(PlayerTurn.NONE, WinType.MATERIAL);
};

const isCheckmateOrStalemate = (_board, _currentTurn) => {
  //_currentTurn is the player who is going to play next
  const hasMoves = hasAnyMoves(_board, _currentTurn);
  if (_currentTurn == "white") {
    if (!hasMoves) {
      if (isWhiteChecked(_board)) {
        return { gameOver: true, winner: "black", winType: "checkmate" };
      } else {
        return { gameOver: true, winner: "none", winType: "stalemate" };
      }
    }
  } else {
    if (!hasMoves) {
      if (isBlackChecked(_board)) {
        return { gameOver: true, winner: "white", winType: "checkmate" };
      } else {
        return { gameOver: true, winner: "none", winType: "stalemate" };
      }
    }
  }
  return { gameOver: false };
};

const hasAnyMoves = (_board, _currentTurn) => {
  let result = false;
  if (_currentTurn == "white") {
    _board.some((row, i) => {
      row.some((cell, j) => {
        if ("PK".includes(cell) && findLegalMoves(i, j, _board).length > 0) {
          result = true;
        }
      });
    });
  }
  if (_currentTurn == "black") {
    _board.some((row, i) => {
      row.some((cell, j) => {
        if ("pk".includes(cell) && findLegalMoves(i, j, _board).length > 0) {
          result = true;
        }
      });
    });
  }
  return result;
};

module.exports = checkEndGameConditions;
