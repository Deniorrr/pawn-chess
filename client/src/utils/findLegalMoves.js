export const findLegalMoves = (i, j, board) => {
  let legalMoves = [];
  let piece = board[i][j];
  switch (piece) {
    case "k":
      legalMoves = blackKingMoves(i, j, board);
      break;
    case "K":
      legalMoves = whiteKingMoves(i, j, board);
      break;
    case "p":
      legalMoves = blackPawnMoves(i, j, board);
      break;
    case "P":
      legalMoves = whitePawnMoves(i, j, board);
      break;
  }
  legalMoves.push([i - 1, j]);
  legalMoves.push([i - 2, j]);
  return legalMoves;
};

const blackKingMoves = (i, j, board) => {
  let moves = [];
  moves.push([i - 1, j]);
  moves.push([i + 1, j]);
  moves.push([i, j + 1]);
  moves.push([i, j - 1]);
  moves.push([i - 1, j - 1]);
  moves.push([i - 1, j + 1]);
  moves.push([i + 1, j - 1]);
  moves.push([i + 1, j + 1]);
  return moves;
};

const whiteKingMoves = (i, j, board) => {
  let moves = [];
  moves.push([i - 1, j]);
  moves.push([i + 1, j]);
  moves.push([i, j + 1]);
  moves.push([i, j - 1]);
  moves.push([i - 1, j - 1]);
  moves.push([i - 1, j + 1]);
  moves.push([i + 1, j - 1]);
  moves.push([i + 1, j + 1]);
  return moves;
};

const blackPawnMoves = (i, j, board) => {
  let moves = [];
  return moves;
};

const whitePawnMoves = (i, j, board) => {
  let moves = [];
  return moves;
};
