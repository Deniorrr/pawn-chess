export const isWhiteChecked = (board) => {
  let whiteKingPos = [];
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === "K") whiteKingPos = [i, j];
    });
  });
  if (whiteKingPos[0] - 1 >= 0 && whiteKingPos[1] - 1 >= 0)
    if (board[whiteKingPos[0] - 1][whiteKingPos[1] - 1] === "p") return true;
  if (whiteKingPos[0] - 1 >= 0 && whiteKingPos[1] + 1 < 8)
    if (board[whiteKingPos[0] - 1][whiteKingPos[1] + 1] === "p") return true;
  return false;
};
