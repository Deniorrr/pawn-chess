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
  // legalMoves.push([i - 1, j]);
  // legalMoves.push([i - 2, j]);
  return legalMoves;
};

const blackKingMoves = (i, j, board) => {
  const allKingMoves = [
    [i - 1, j],
    [i + 1, j],
    [i, j + 1],
    [i, j - 1],
    [i - 1, j - 1],
    [i - 1, j + 1],
    [i + 1, j - 1],
    [i + 1, j + 1],
  ];
  let moves = [];
  let whiteKingPos = [];
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === "K") whiteKingPos = [i, j];
    });
  });
  allKingMoves.forEach((move) => {
    if (
      !(
        move[0] >= whiteKingPos[0] - 1 &&
        move[0] <= whiteKingPos[0] + 1 &&
        move[1] >= whiteKingPos[1] - 1 &&
        move[1] <= whiteKingPos[1] + 1
      )
    ) {
      if (move[0] >= 0 && move[0] < 8 && move[1] >= 0 && move[1] < 8) {
        // check if move is within bounds
        if (board[move[0]][move[1]] !== "p") {
          if (
            move[0] - 1 >= 0 &&
            move[1] - 1 >= 0 &&
            move[0] + 1 < 8 &&
            move[1] + 1 < 8
          ) {
            if (
              // check if move is not attacked by a white pawn
              board[move[0] + 1][move[1] + 1] !== "P" &&
              board[move[0] + 1][move[1] - 1] !== "P"
            )
              moves.push(move);
          } else {
            moves.push(move);
          }
          // check if move is not on a black pawn
        }
      }
    }
  });
  return moves;
};

const whiteKingMoves = (i, j, board) => {
  const allKingMoves = [
    [i - 1, j],
    [i + 1, j],
    [i, j + 1],
    [i, j - 1],
    [i - 1, j - 1],
    [i - 1, j + 1],
    [i + 1, j - 1],
    [i + 1, j + 1],
  ];
  let moves = [];
  let blackKingPos = [];
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === "k") blackKingPos = [i, j];
    });
  });
  allKingMoves.forEach((move) => {
    if (
      !(
        move[0] >= blackKingPos[0] - 1 &&
        move[0] <= blackKingPos[0] + 1 &&
        move[1] >= blackKingPos[1] - 1 &&
        move[1] <= blackKingPos[1] + 1
      )
    ) {
      // console.log(board, move[0], move[1]);
      if (move[0] >= 0 && move[0] < 8 && move[1] >= 0 && move[1] < 8) {
        if (board[move[0]][move[1]] !== "P") {
          if (
            move[0] - 1 >= 0 &&
            move[1] - 1 >= 0 &&
            move[0] + 1 < 8 &&
            move[1] + 1 < 8
          ) {
            if (
              // check if move is not attacked by a white pawn
              board[move[0] - 1][move[1] + 1] !== "p" &&
              board[move[0] - 1][move[1] - 1] !== "p"
            )
              moves.push(move);
          } else {
            moves.push(move);
          }
        }
      }
    }
  });
  return moves;
};

const blackPawnMoves = (i, j, board) => {
  let moves = [];
  if (board[i + 1][j] === " ") moves.push([i + 1, j]); // move one step forward
  if (i === 1 && board[i + 2][j] === " ") moves.push([i + 2, j]); // move two steps forward
  if (i + 1 < 8 && j + 1 < 8)
    if (board[i + 1][j + 1] === "P" || board[i + 1][j + 1] === "-")
      moves.push([i + 1, j + 1]); // attack right
  if (i + 1 < 8 && j - 1 >= 0)
    if (board[i + 1][j - 1] === "P" || board[i + 1][j - 1] === "-")
      moves.push([i + 1, j - 1]); // attack left
  return moves;
};

const whitePawnMoves = (i, j, board) => {
  let moves = [];
  if (board[i - 1][j] === " ") moves.push([i - 1, j]); // move one step forward
  if (i === 6 && board[i - 2][j] === " ") moves.push([i - 2, j]); // move two steps forward
  if (i - 1 >= 0 && j + 1 < 8)
    if (board[i - 1][j + 1] === "p" || board[i - 1][j + 1] === "-")
      moves.push([i - 1, j + 1]); // attack right
  if (i - 1 >= 0 && j - 1 >= 0)
    if (board[i - 1][j - 1] === "p" || board[i - 1][j - 1] === "-")
      moves.push([i - 1, j - 1]); // attack left
  return moves;
};

//TODO
// checked king
// checkmate

//DONE
// kings can't touch each other
// en passant
// removing pawn after en passant
