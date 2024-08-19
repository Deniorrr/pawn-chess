const generateBoardAfterMove = (board, selectedPiece, toPos) => {
  //check if move is an en passant
  const [i, j] = toPos;
  if (
    board[selectedPiece[0]][selectedPiece[1]] === "P" &&
    board[i][j] === "-"
  ) {
    board[i + 1][j] = " ";
  }
  if (
    board[selectedPiece[0]][selectedPiece[1]] === "p" &&
    board[i][j] === "-"
  ) {
    board[i - 1][j] = " ";
  }
  //clean previous en passant
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === "-") {
        board[row][col] = " ";
      }
    }
  }
  //add en passant
  if (selectedPiece[0] === 1 && i === 3) {
    board[2][j] = "-";
  }
  if (selectedPiece[0] === 6 && i === 4) {
    board[5][j] = "-";
  }
  if (board[selectedPiece[0]][selectedPiece[1]] === "P" && i === 0) {
    board[selectedPiece[0]][selectedPiece[1]] = " ";
  }
  if (board[selectedPiece[0]][selectedPiece[1]] === "p" && i === 7) {
    board[selectedPiece[0]][selectedPiece[1]] = " ";
  }
  //move the actual piece
  board[i][j] = board[selectedPiece[0]][selectedPiece[1]];
  board[selectedPiece[0]][selectedPiece[1]] = " ";
  return board;
};

module.exports = generateBoardAfterMove;
