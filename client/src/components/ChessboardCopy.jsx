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

Chessboard.propTypes = {
  addPoint: PropTypes.func.isRequired,
  endViaCheckmate: PropTypes.func.isRequired,
  endViaStalemate: PropTypes.func.isRequired,
  setIsWhiteTurn: PropTypes.func.isRequired,
  endViaMaterial: PropTypes.func.isRequired,
};

function Chessboard(props) {
  const addPoint = props.addPoint;
  const endViaCheckmate = props.endViaCheckmate;
  const endViaStalemate = props.endViaStalemate;
  const endViaMaterial = props.endViaMaterial;

  const initialBoard = [
    [" ", " ", " ", " ", "k", " ", " ", " "],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    [" ", " ", " ", " ", "K", " ", " ", " "],
  ];

  // const initialBoard = [
  //   [" ", " ", " ", " ", "k", " ", " ", " "],
  //   [" ", " ", " ", " ", "p", "P", " ", " "],
  //   [" ", " ", " ", "P", "K", " ", " ", " "],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  // ];

  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [isBoardRotated, setIsBoardRotated] = useState(false);
  const [legalMoves, setLegalMoves] = useState([]);

  const [cellSize, setCellSize] = useState(85);
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [evaluation, setEvaluation] = useState(0);
  const [showEval, setShowEval] = useState(false);

  const areObjectsSame = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b) ? true : false;
  };

  const getNextMove = (fen) => {
    console.log(fen);

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
        const from = [8 - bestmove[1], letterToNumber[bestmove[0]]];
        const to = [8 - bestmove[3], letterToNumber[bestmove[2]]];
        stockFishMove(from, to);
      });
  };
  const convertBoardToFen = (board, _isWhiteTurn) => {
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

  const selectPiece = (i, j) => {
    if (areObjectsSame(selectedPiece, [i, j])) {
      setLegalMoves([]);
      return setSelectedPiece(null);
    }
    if (selectedPiece === null) {
      if (isWhiteTurn && board[i][j] === board[i][j].toLowerCase()) {
        return;
      }
      if (!isWhiteTurn && board[i][j] === board[i][j].toUpperCase()) {
        return;
      }
      if (board[i][j] === " ") {
        return;
      }
      setLegalMoves(findLegalMoves(i, j, board));
      return setSelectedPiece([i, j]);
    }
    if (legalMoves.find((move) => areObjectsSame(move, [i, j]))) {
      return movePiece(i, j);
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

  const stockFishMove = (from, [i, j]) => {
    if (board[from[0]][from[1]] === "P" && i === 0) addPoint("white");
    if (board[from[0]][from[1]] === "p" && i === 7) addPoint("black");
    const boardAfterMove = generateBoardAfterMove([...board], from, [i, j]);
    setBoard(boardAfterMove);
    setSelectedPiece(null);
    setLegalMoves([]);
    setIsWhiteTurn(true);
    props.setIsWhiteTurn(true);
  };

  const movePiece = (i, j) => {
    if (board[selectedPiece[0]][selectedPiece[1]] === "P" && i === 0)
      addPoint("white");
    if (board[selectedPiece[0]][selectedPiece[1]] === "p" && i === 7)
      addPoint("black");
    const boardAfterMove = generateBoardAfterMove([...board], selectedPiece, [
      i,
      j,
    ]);
    setBoard(boardAfterMove);
    if (isWhiteTurn) {
      getNextMove(convertBoardToFen(boardAfterMove, isWhiteTurn));
    }
    setSelectedPiece(null);
    setLegalMoves([]);
    setIsWhiteTurn(false);
    props.setIsWhiteTurn(false);
  };

  const generateColor = (i, j) => {
    if (areObjectsSame(selectedPiece, [i, j])) {
      return brown["A400"];
    }
    return (i + j) % 2 === 0 ? "white" : "gray";
  };

  const generateBorder = (i, j) => {
    return legalMoves.find((move) => areObjectsSame(move, [i, j]))
      ? "2px solid red"
      : "none";
  };

  const renderPiece = (piece) => {
    switch (piece) {
      case "k":
        return <img src={k} alt="k" style={{ width: "100%" }} />;
      case "K":
        return <img src={kw} alt="kw" style={{ width: "100%" }} />;
      case "p":
        return <img src={p} alt="p" style={{ width: "100%" }} />;
      case "P":
        return <img src={pw} alt="pw" style={{ width: "100%" }} />;
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
        <Grid container spacing={1} my={1} alignItems={"center"}>
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
          <Grid item>
            <Button
              variant="contained"
              onClick={() => setShowEval(!showEval)}
              size="large"
            >
              {showEval ? "Hide" : "Show"} evaluation
            </Button>
          </Grid>
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
