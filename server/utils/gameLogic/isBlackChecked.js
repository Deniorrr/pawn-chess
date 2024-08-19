export const isBlackChecked = (board) => {
  let blackKingPos = [];
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === "k") blackKingPos = [i, j];
    });
  });
  if (blackKingPos[0] + 1 < 8 && blackKingPos[1] - 1 >= 0)
    if (board[blackKingPos[0] + 1][blackKingPos[1] - 1] === "P") return true;
  if (blackKingPos[0] + 1 < 8 && blackKingPos[1] + 1 < 8)
    if (board[blackKingPos[0] + 1][blackKingPos[1] + 1] === "P") return true;
  return false;
};
