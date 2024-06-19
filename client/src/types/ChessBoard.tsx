export type ChessSquare = " " | "p" | "P" | "k" | "K" | "-";
export type ChessRow = [
  ChessSquare,
  ChessSquare,
  ChessSquare,
  ChessSquare,
  ChessSquare,
  ChessSquare,
  ChessSquare,
  ChessSquare
];
export type ChessBoard = [
  ChessRow,
  ChessRow,
  ChessRow,
  ChessRow,
  ChessRow,
  ChessRow,
  ChessRow,
  ChessRow
];
