import { generateBoardAfterMove } from "./generateBoardAfterMove.js";
import {
  ChessBoard,
  ChessSquare,
  ChessCoord,
} from "../../types/ChessBoardTypes.js";
import { isWhiteChecked } from "./isWhiteChecked.js";
import { isBlackChecked } from "./isBlackChecked.js";

let piece: ChessSquare;

export const findLegalMoves = (
  i: number,
  j: number,
  board: ChessBoard
): ChessCoord[] => {
  let legalMoves: ChessCoord[] = [];
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

const blackKingMoves = (
  i: number,
  j: number,
  board: ChessBoard
): ChessCoord[] => {
  const allKingMoves: ChessCoord[] = [
    [i - 1, j],
    [i + 1, j],
    [i, j + 1],
    [i, j - 1],
    [i - 1, j - 1],
    [i - 1, j + 1],
    [i + 1, j - 1],
    [i + 1, j + 1],
  ];
  const moves: ChessCoord[] = [];
  let whiteKingPos: ChessCoord;
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
      if (move[0] >= 0 && move[0] < 8 && move[1] >= 0 && move[1] < 8)
        if (board[move[0]][move[1]] !== "p")
          addMove(board, moves, [i, j], move, false);
    }
  });
  return moves;
};

const whiteKingMoves = (
  i: number,
  j: number,
  board: ChessBoard
): ChessCoord[] => {
  const allKingMoves: ChessCoord[] = [
    [i - 1, j],
    [i + 1, j],
    [i, j + 1],
    [i, j - 1],
    [i - 1, j - 1],
    [i - 1, j + 1],
    [i + 1, j - 1],
    [i + 1, j + 1],
  ];
  const moves: ChessCoord[] = [];
  let blackKingPos: ChessCoord;
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
      if (move[0] >= 0 && move[0] < 8 && move[1] >= 0 && move[1] < 8)
        if (board[move[0]][move[1]] !== "P")
          addMove(board, moves, [i, j], move, true);
    }
  });
  return moves;
};

const blackPawnMoves = (
  i: number,
  j: number,
  board: ChessBoard
): ChessCoord[] => {
  const moves: ChessCoord[] = [];
  if (board[i + 1][j] === " ") {
    addMove(board, moves, [i, j], [i + 1, j], false);
    if (i === 1 && board[i + 2][j] === " ")
      addMove(board, moves, [i, j], [i + 2, j], false);
  }
  if (i + 1 < 8 && j + 1 < 8)
    if (board[i + 1][j + 1] === "P" || board[i + 1][j + 1] === "-")
      addMove(board, moves, [i, j], [i + 1, j + 1], false);
  if (i + 1 < 8 && j - 1 >= 0)
    if (board[i + 1][j - 1] === "P" || board[i + 1][j - 1] === "-")
      addMove(board, moves, [i, j], [i + 1, j - 1], false);
  return moves;
};

const whitePawnMoves = (i: number, j: number, board: ChessBoard) => {
  const moves: ChessCoord[] = [];
  if (board[i - 1][j] === " ") {
    addMove(board, moves, [i, j], [i - 1, j], true);
    if (i === 6 && board[i - 2][j] === " ")
      addMove(board, moves, [i, j], [i - 2, j], true);
  }
  if (i - 1 >= 0 && j + 1 < 8)
    if (board[i - 1][j + 1] === "p" || board[i - 1][j + 1] === "-")
      addMove(board, moves, [i, j], [i - 1, j + 1], true);
  if (i - 1 >= 0 && j - 1 >= 0)
    if (board[i - 1][j - 1] === "p" || board[i - 1][j - 1] === "-")
      addMove(board, moves, [i, j], [i - 1, j - 1], true);
  return moves;
};

const addMove = (
  board: ChessBoard,
  moves: ChessCoord[],
  from: ChessCoord,
  to: ChessCoord,
  isWhite: boolean
) => {
  const _board: ChessBoard = JSON.parse(JSON.stringify(board)); //deep copy because two dimensional array is passed by reference
  const boardAfterMove: ChessBoard = generateBoardAfterMove(_board, from, to);
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
