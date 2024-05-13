import { Button, Grid, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { brown } from "@mui/material/colors";
import k from "../assets/k.svg";
import kw from "../assets/kw.svg";
import p from "../assets/p.svg";
import pw from "../assets/pw.svg";
import { findLegalMoves } from "../utils/gameLogic/findLegalMoves";
import { generateBoardAfterMove } from "../utils/gameLogic/generateBoardAfterMove";
import { isWhiteChecked } from "../utils/gameLogic/isWhiteChecked";
import { isBlackChecked } from "../utils/gameLogic/isBlackChecked";
import PropTypes from "prop-types";

Chessboard.propTypes = {
  addPoint: PropTypes.func.isRequired,
  endViaCheckmate: PropTypes.func.isRequired,
  endViaStalemate: PropTypes.func.isRequired,
};

function Chessboard(props) {
  const addPoint = props.addPoint;
  const endViaCheckmate = props.endViaCheckmate;
  const endViaStalemate = props.endViaStalemate;

  // const initialBoard = [
  //   [" ", " ", " ", " ", "k", " ", " ", " "],
  //   ["p", "p", "p", "p", "p", "p", "p", "p"],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  //   ["P", "P", "P", "P", "P", "P", "P", "P"],
  //   [" ", " ", " ", " ", "K", " ", " ", " "],
  // ];

  const initialBoard = [
    [" ", " ", " ", " ", "k", " ", " ", " "],
    [" ", " ", " ", " ", "p", " ", " ", " "],
    [" ", " ", " ", "P", "K", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
  ];

  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [isBoardRotated, setIsBoardRotated] = useState(false);
  const [legalMoves, setLegalMoves] = useState([]);

  const [cellSize, setCellSize] = useState(85);
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
      endViaStalemate();
    }
  };

  useEffect(() => {
    isCheckmateOrStalemate();
    isMaterialDraw();
  }, [board]);

  const movePiece = (i, j) => {
    if (board[selectedPiece[0]][selectedPiece[1]] === "P" && i === 0)
      addPoint("white");
    if (board[selectedPiece[0]][selectedPiece[1]] === "p" && i === 7)
      addPoint("black");
    setBoard(generateBoardAfterMove([...board], selectedPiece, [i, j]));
    setSelectedPiece(null);
    setLegalMoves([]);
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
        return `${piece}`;
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
  );
}

export default Chessboard;
