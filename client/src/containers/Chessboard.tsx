import { Button, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
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
import axios from "axios";
import { ChessBoard, ChessCoord, ChessSquare } from "../types/ChessBoardTypes";

Chessboard.propTypes = {
  addPoint: PropTypes.func.isRequired,
  endViaCheckmate: PropTypes.func.isRequired,
  endViaStalemate: PropTypes.func.isRequired,
  setIsWhiteTurn: PropTypes.func.isRequired,
  endViaMaterial: PropTypes.func.isRequired,
  isPlayingVsBot: PropTypes.bool.isRequired,
};

interface ChessboardProps {
  addPoint: (player: string) => void;
  endViaCheckmate: (winner: string) => void;
  endViaStalemate: () => void;
  setIsWhiteTurn: (isWhiteTurn: boolean) => void;
  endViaMaterial: () => void;
  isPlayingVsBot: boolean;
}

function Chessboard(props: ChessboardProps) {
  const {
    addPoint,
    endViaCheckmate,
    endViaStalemate,
    endViaMaterial,
    isPlayingVsBot = false, // Provide a default value of false
  } = props;

  const initialBoard: ChessBoard = [
    [" ", " ", " ", " ", "k", " ", " ", " "],
    [" ", " ", " ", " ", "p", "P", " ", " "],
    [" ", " ", " ", "P", "K", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
  ];

  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [isBoardRotated, setIsBoardRotated] = useState(false);
  const [legalMoves, setLegalMoves] = useState<ChessCoord[]>([]);

  const [cellSize, setCellSize] = useState(85);
  const [board, setBoard] = useState<ChessBoard>(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(
    null
  );
  const [evaluation, setEvaluation] = useState(0);
  const [showEval, setShowEval] = useState(false);

  const areObjectsSame = (a: object | null, b: object | null): boolean => {
    return JSON.stringify(a) === JSON.stringify(b) ? true : false;
  };

  const getNextMove = (fen: string) => {
    axios
      .get(`https://stockfish.online/api/s/v2.php?fen=${fen}&depth=11`)
      .then((res) => {
        let bestmove = res.data.bestmove;
        bestmove = bestmove.split("bestmove ")[1].substring(0, 4);
        const letterToNumber = {
          a: 0,
          b: 1,
          c: 2,
          d: 3,
          e: 4,
          f: 5,
          g: 6,
          h: 7,
        };
        setEvaluation(res.data.evaluation);
        const from: [number, number] = [
          8 - bestmove[1],
          letterToNumber[bestmove[0] as keyof typeof letterToNumber],
        ];
        const to: [number, number] = [
          8 - bestmove[3],
          letterToNumber[bestmove[2] as keyof typeof letterToNumber],
        ];
        stockFishMove(from, to);
      });
  };
  const convertBoardToFen = (
    board: ChessBoard,
    _isWhiteTurn: boolean
  ): string => {
    let fen = "";
    board.forEach((row) => {
      let emptySpaces = 0;
      row.forEach((cell) => {
        if (cell === " " || cell === "-") {
          emptySpaces++;
        } else {
          if (emptySpaces > 0) {
            fen += emptySpaces;
            emptySpaces = 0;
          }
          fen += cell;
        }
      });
      if (emptySpaces > 0) {
        fen += emptySpaces;
      }
      fen += "/";
    });
    fen = fen.slice(0, -1);
    fen += _isWhiteTurn ? " b " : " w ";
    fen += "KQkq - 0 1";
    fen = fen.replace(/ /g, "%20");
    return fen;
  };

  const selectPiece = (row: number, column: number) => {
    if (isPlayingVsBot && !isWhiteTurn) return;
    if (areObjectsSame(selectedPiece, [row, column])) {
      setLegalMoves([]);
      return setSelectedPiece(null);
    }
    if (selectedPiece === null) {
      if (
        isWhiteTurn &&
        board[row][column] === board[row][column].toLowerCase()
      ) {
        return;
      }
      if (
        !isWhiteTurn &&
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
    if (isWhiteTurn) {
      board.some((row, i) => {
        row.some((cell, j) => {
          if ("PK".includes(cell) && findLegalMoves(i, j, board).length > 0) {
            result = true;
          }
        });
      });
    }
    if (!isWhiteTurn) {
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
    if (isWhiteTurn) {
      if (!hasMoves) {
        if (isWhiteChecked(board)) {
          endViaCheckmate("black");
        } else {
          endViaStalemate();
        }
      }
    } else {
      if (!hasMoves) {
        if (isBlackChecked(board)) {
          endViaCheckmate("white");
        } else {
          endViaStalemate();
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
      endViaMaterial();
    }
  };

  useEffect(() => {
    isCheckmateOrStalemate();
    isMaterialDraw();
  }, [board]);

  const stockFishMove = (from: [number, number], to: [number, number]) => {
    const i = to[0];
    const j = to[1];
    if (board[from[0]][from[1]] === "P" && i === 0) addPoint("white");
    if (board[from[0]][from[1]] === "p" && i === 7) addPoint("black");
    const boardAfterMove = generateBoardAfterMove([...board], from, [i, j]);
    setBoard(boardAfterMove);
    setSelectedPiece(null);
    setLegalMoves([]);
    setIsWhiteTurn(true);
    props.setIsWhiteTurn(true);
  };

  const movePiece = (i: number, j: number) => {
    if (!selectedPiece) return;
    if (board[selectedPiece![0]][selectedPiece![1]] === "P" && i === 0)
      addPoint("white");
    if (board[selectedPiece![0]][selectedPiece![1]] === "p" && i === 7)
      addPoint("black");
    const boardAfterMove = generateBoardAfterMove([...board], selectedPiece, [
      i,
      j,
    ]);
    setBoard(boardAfterMove);
    if (isPlayingVsBot) {
      if (isWhiteTurn) {
        getNextMove(convertBoardToFen(boardAfterMove, isWhiteTurn));
      }
      setSelectedPiece(null);
      setLegalMoves([]);
      setIsWhiteTurn(false);
      props.setIsWhiteTurn(false);
    } else {
      setSelectedPiece(null);
      setLegalMoves([]);
      setIsWhiteTurn(!isWhiteTurn);
      props.setIsWhiteTurn(!isWhiteTurn);
    }
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

  // const resetGame = () => {
  //   setBoard(initialBoard);
  //   setIsWhiteTurn(true);
  //   setLegalMoves([]);
  //   setSelectedPiece(null);
  // };

  const rotateChessboard = () => {
    setIsBoardRotated(!isBoardRotated);
  };

  return (
    <>
      <Paper elevation={0} style={{ backgroundColor: "#bcd2da" }}>
        <Grid container spacing={1} my={1}>
          {/* <Grid item>
            <Button variant="contained" onClick={resetGame} size="large">
              Reset
            </Button>
          </Grid> */}
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
          {isPlayingVsBot && (
            <Grid item>
              <Button
                variant="contained"
                onClick={() => setShowEval(!showEval)}
                size="large"
              >
                {showEval ? "Hide" : "Show"} evaluation
              </Button>
            </Grid>
          )}
        </Grid>
        <Typography
          variant="h5"
          margin={1}
          style={{
            display: showEval ? "block" : "none",
          }}
        >
          Eval: {evaluation}
        </Typography>
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

export default Chessboard;
