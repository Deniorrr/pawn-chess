import { generateBoardAfterMove } from "./generateBoardAfterMove.js";
import { isWhiteChecked } from "./isWhiteChecked.js";
import { isBlackChecked } from "./isBlackChecked.js";

let piece;

export const findLegalMoves = (i, j, board) => {
  let legalMoves = [];
  piece = board[i][j];
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
              addMove(board, moves, [i, j], move, false);
          } else {
            addMove(board, moves, [i, j], move, false);
            //moves.push(move);
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
      // if (move[0] >= 0 && move[0] < 8 && move[1] >= 0 && move[1] < 8) {
      //   if (board[move[0]][move[1]] !== "P") {
      //     if (
      //       move[0] - 1 >= 0 &&
      //       move[1] - 1 >= 0 &&
      //       move[0] + 1 < 8 &&
      //       move[1] + 1 < 8
      //     ) {
      //       if (
      //         // check if move is not attacked by a white pawn
      //         board[move[0] - 1][move[1] + 1] !== "p" &&
      //         board[move[0] - 1][move[1] - 1] !== "p"
      //       )
      //         addMove(board, moves, [i, j], move, true);
      //     } else {
      //       addMove(board, moves, [i, j], move, true);
      //     }
      //   }
      // }

      //i'm checking this somewher else
      try {
        if (move[0] >= 0 && move[0] < 8 && move[1] >= 0 && move[1] < 8)
          if (
            board[move[0] - 1][move[1] + 1] !== "p" && //DEBUG THIS
            board[move[0] - 1][move[1] - 1] !== "p"
          )
            if (board[move[0]][move[1]] !== "P")
              addMove(board, moves, [i, j], move, true);
      } catch (e) {
        console.log(e);
      }
    }
  });
  return moves;
};

const blackPawnMoves = (i, j, board) => {
  let moves = [];
  if (board[i + 1][j] === " ") {
    //moves.push([i + 1, j]); // move one step forward
    addMove(board, moves, [i, j], [i + 1, j], false);
    if (i === 1 && board[i + 2][j] === " ")
      //moves.push([i + 2, j]); // move two steps forward
      addMove(board, moves, [i, j], [i + 2, j], false);
  }
  if (i + 1 < 8 && j + 1 < 8)
    if (board[i + 1][j + 1] === "P" || board[i + 1][j + 1] === "-")
      addMove(board, moves, [i, j], [i + 1, j + 1], false);
  //moves.push([i + 1, j + 1]); // attack right
  if (i + 1 < 8 && j - 1 >= 0)
    if (board[i + 1][j - 1] === "P" || board[i + 1][j - 1] === "-")
      addMove(board, moves, [i, j], [i + 1, j - 1], false);
  //moves.push([i + 1, j - 1]); // attack left
  return moves;
};

const whitePawnMoves = (i, j, board) => {
  let moves = [];
  if (board[i - 1][j] === " ") {
    //moves.push([i - 1, j]); // move one step forward
    addMove(board, moves, [i, j], [i - 1, j], true);
    if (i === 6 && board[i - 2][j] === " ")
      //moves.push([i - 2, j]); // move two steps forward
      addMove(board, moves, [i, j], [i - 2, j], true);
  }
  if (i - 1 >= 0 && j + 1 < 8)
    if (board[i - 1][j + 1] === "p" || board[i - 1][j + 1] === "-")
      //moves.push([i - 1, j + 1]); // attack right
      addMove(board, moves, [i, j], [i - 1, j + 1], true);
  if (i - 1 >= 0 && j - 1 >= 0)
    if (board[i - 1][j - 1] === "p" || board[i - 1][j - 1] === "-")
      //moves.push([i - 1, j - 1]); // attack left
      addMove(board, moves, [i, j], [i - 1, j - 1], true);
  return moves;
};

const addMove = (board, moves, from, to, isWhite) => {
  let _board = JSON.parse(JSON.stringify(board)); //deep copy because two dimensional array is passed by reference
  let boardAfterMove = generateBoardAfterMove(_board, from, to);
  if (isWhite) {
    if (isWhiteChecked(boardAfterMove)) {
      return;
    }
  }
  if (!isWhite) {
    if (isBlackChecked(boardAfterMove)) {
      return;
    }
  }
  moves.push(to);
};
