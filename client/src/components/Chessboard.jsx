import { Button, Grid, Paper } from "@mui/material";
import { useState } from "react";
import { brown } from "@mui/material/colors";
import k from "../assets/k.svg";
import kw from "../assets/kw.svg";
import p from "../assets/p.svg";
import pw from "../assets/pw.svg";
import { findLegalMoves } from "../utils/findLegalMoves";

function Chessboard() {
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

  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [isBoardRotated, setIsBoardRotated] = useState(false);
  const [legalMoves, setLegalMoves] = useState([]);

  const [cellSize, setCellSize] = useState(60);
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const areObjectsSame = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b) ? true : false;
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

  // const findLegalMoves = (i, j) => {
  //   // let moves = [];
  //   // let piece = board[i][j];
  //   // console.log(piece);
  //   // if (piece === "k") {
  //   //   moves.push([i - 1, j - 1]);
  //   //   moves.push([i - 1, j + 1]);
  //   //   moves.push([i + 1, j - 1]);
  //   //   moves.push([i + 1, j + 1]);
  //   //   setLegalMoves([...moves]);
  //   //   return;
  //   // }
  //   setLegalMoves(findLegalMoves(i, j, board));
  // };

  const movePiece = (i, j) => {
    board[i][j] = board[selectedPiece[0]][selectedPiece[1]];
    board[selectedPiece[0]][selectedPiece[1]] = " ";
    setSelectedPiece(null);
    setLegalMoves([]);
    setBoard([...board]);
    setIsWhiteTurn(!isWhiteTurn);
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
      default:
        return null;
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setIsWhiteTurn(true);
    setLegalMoves([]);
    setSelectedPiece(null);
  };

  const rotateChessboard = () => {
    setIsBoardRotated(!isBoardRotated);
  };

  return (
    <Paper elevation={0}>
      <Grid container spacing={1} my={1}>
        <Grid item>
          <Button variant="contained" onClick={resetGame}>
            Reset
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => setCellSize(cellSize + 5)}>
            +
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => setCellSize(cellSize - 5)}>
            -
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => rotateChessboard()}>
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
            <Grid container key={i}>
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
  );
}

export default Chessboard;
