import { Button, Grid, Paper } from "@mui/material";
import { useState } from "react";
import { brown } from "@mui/material/colors";
import k from "../assets/k.svg";
import kw from "../assets/kw.svg";
import p from "../assets/p.svg";
import pw from "../assets/pw.svg";
import { findLegalMoves } from "../utils/gameLogic/findLegalMoves.js";
import { generateBoardAfterMove } from "../utils/gameLogic/generateBoardAfterMove.js";
import { isWhiteChecked } from "../utils/gameLogic/isWhiteChecked.js";
import { isBlackChecked } from "../utils/gameLogic/isBlackChecked.js";
import PropTypes from "prop-types";
import { ChessBoard, ChessCoord, ChessSquare } from "../types/ChessBoardTypes";
import { PlayerTurn } from "../types/PlayerTurnEnum";
import { WinType } from "../types/WinTypeEnum";

MultiplayerChessboard.propTypes = {
  currentTurn: PropTypes.string.isRequired,
  onGameOver: PropTypes.func.isRequired,
  addPoint: PropTypes.func.isRequired,
  playerColor: PropTypes.string.isRequired,
};

interface ChessboardProps {
  currentTurn: PlayerTurn;
  onChangePosition: (
    from: ChessCoord,
    to: ChessCoord,
    chessboard: ChessBoard
  ) => void;
  board: ChessBoard;
  onGameOver: (winner: PlayerTurn, winType: WinType) => void;
  addPoint: (player: PlayerTurn) => void;
  playerColor: PlayerTurn;
}

function MultiplayerChessboard(props: ChessboardProps) {
  const {
    addPoint,
    onChangePosition,
    board,
    currentTurn,
    onGameOver,
    playerColor,
  } = props;

  const [isBoardRotated, setIsBoardRotated] = useState(false);
  const [legalMoves, setLegalMoves] = useState<ChessCoord[]>([]);

  const [cellSize, setCellSize] = useState(85);
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(
    null
  );

  const areObjectsSame = (a: object | null, b: object | null): boolean => {
    return JSON.stringify(a) === JSON.stringify(b) ? true : false;
  };

  const selectPiece = (row: number, column: number) => {
    if (
      playerColor.toString().toUpperCase() !==
      PlayerTurn[currentTurn].toString().toUpperCase()
    )
      return;

    if (areObjectsSame(selectedPiece, [row, column])) {
      setLegalMoves([]);
      return setSelectedPiece(null);
    }
    if (selectedPiece === null) {
      if (
        currentTurn == PlayerTurn.WHITE &&
        board[row][column] === board[row][column].toLowerCase()
      ) {
        return;
      }
      if (
        currentTurn == PlayerTurn.BLACK &&
        board[row][column] === board[row][column].toUpperCase()
      ) {
        return;
      }
      if (board[row][column] === " ") {
        return;
      }
      setLegalMoves(findLegalMoves(row, column, board));
      return setSelectedPiece([row, column]);
    }
    if (legalMoves.find((move) => areObjectsSame(move, [row, column]))) {
      return movePiece(row, column);
    }
    setLegalMoves([]);
    setSelectedPiece(null);
  };

  const hasAnyMoves = () => {
    let result = false;
    if (currentTurn == PlayerTurn.WHITE) {
      board.some((row, i) => {
        row.some((cell, j) => {
          if ("PK".includes(cell) && findLegalMoves(i, j, board).length > 0) {
            result = true;
          }
        });
      });
    }
    if (currentTurn == PlayerTurn.BLACK) {
      board.some((row, i) => {
        row.some((cell, j) => {
          if ("pk".includes(cell) && findLegalMoves(i, j, board).length > 0) {
            result = true;
          }
        });
      });
    }
    return result;
  };

  const isCheckmateOrStalemate = () => {
    const hasMoves = hasAnyMoves();
    if (currentTurn == PlayerTurn.WHITE) {
      if (!hasMoves) {
        if (isWhiteChecked(board)) {
          onGameOver(PlayerTurn.BLACK, WinType.CHECKMATE);
        } else {
          onGameOver(PlayerTurn.NONE, WinType.STALEMATE);
        }
      }
    } else {
      if (!hasMoves) {
        if (isBlackChecked(board)) {
          onGameOver(PlayerTurn.WHITE, WinType.CHECKMATE);
        } else {
          onGameOver(PlayerTurn.NONE, WinType.STALEMATE);
        }
      }
    }
  };

  const isMaterialDraw = () => {
    const whitePieces = board
      .flat()
      .filter((piece) => "PK".includes(piece)).length;
    const blackPieces = board
      .flat()
      .filter((piece) => "pk".includes(piece)).length;
    if (whitePieces === 1 && blackPieces === 1) {
      onGameOver(PlayerTurn.NONE, WinType.MATERIAL);
    }
  };

  const movePiece = (i: number, j: number) => {
    if (!selectedPiece) return;
    if (board[selectedPiece![0]][selectedPiece![1]] === "P" && i === 0)
      addPoint(PlayerTurn.WHITE);
    if (board[selectedPiece![0]][selectedPiece![1]] === "p" && i === 7)
      addPoint(PlayerTurn.BLACK);
    const selectedPosition: ChessCoord = [i, j];
    const boardAfterMove = generateBoardAfterMove(
      [...board],
      selectedPiece,
      selectedPosition
    );

    onChangePosition(selectedPiece, selectedPosition, boardAfterMove);
    //check end game conditions
    isCheckmateOrStalemate();
    isMaterialDraw();
    //
    setSelectedPiece(null);
    setLegalMoves([]);
  };

  const generateColor = (i: number, j: number) => {
    if (areObjectsSame(selectedPiece, [i, j])) {
      return brown["A400"];
    }
    return (i + j) % 2 === 0 ? "white" : "gray";
  };

  const generateBorder = (i: number, j: number) => {
    return legalMoves.find((move) => areObjectsSame(move, [i, j]))
      ? "2px solid red"
      : "none";
  };

  const renderPiece = (piece: ChessSquare) => {
    switch (piece) {
      case "k":
        return <img src={k.toString()} alt="k" style={{ width: "100%" }} />; //k.toString() so typescript doesn't complain
      case "K":
        return <img src={kw.toString()} alt="kw" style={{ width: "100%" }} />;
      case "p":
        return <img src={p.toString()} alt="p" style={{ width: "100%" }} />;
      case "P":
        return <img src={pw.toString()} alt="pw" style={{ width: "100%" }} />;
      case "-":
        return " ";
      default:
        return `${piece}`;
    }
  };

  const rotateChessboard = () => {
    setIsBoardRotated(!isBoardRotated);
  };

  return (
    <>
      <Paper elevation={0} style={{ backgroundColor: "#bcd2da" }}>
        <Grid container spacing={1} my={1}>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => setCellSize(cellSize + 5)}
              size="large"
            >
              +
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => setCellSize(cellSize - 5)}
              size="large"
            >
              -
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => rotateChessboard()}
              size="large"
            >
              Rotate chessboard
            </Button>
          </Grid>
        </Grid>

        <Grid container aria-label="chessboard wrapper">
          <Paper
            elevation={24}
            style={{
              transform: isBoardRotated ? "rotate(180deg)" : "none",
              transition: "transform 0.5s",
            }}
          >
            {board.map((row, i) => (
              <Grid container key={i} style={{ flexWrap: "nowrap" }}>
                {row.map((piece, j) => (
                  <Grid item key={j}>
                    <Paper
                      style={{
                        cursor: "pointer",
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        backgroundColor: generateColor(i, j),
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxSizing: "border-box",
                        border: generateBorder(i, j),
                        transform: isBoardRotated ? "rotate(-180deg)" : "none",
                        transition: "transform 0.5s",
                      }}
                      onClick={() => selectPiece(i, j)}
                    >
                      {renderPiece(piece)}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ))}
          </Paper>
        </Grid>
      </Paper>
    </>
  );
}

export default MultiplayerChessboard;
