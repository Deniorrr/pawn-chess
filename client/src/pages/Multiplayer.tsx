import MultiplayerChessboard from "../containers/MultiplayerChessboard.js";
import { Container, Paper, Typography, Grid, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayerScores from "../components/PlayerScores.js";
import EndScreen from "../components/EndScreen.js";
import io from "socket.io-client";
import { ChessBoard } from "../types/ChessBoardTypes.js";

const socket = io.connect("http://localhost:3000");

function Multiplayer() {
  const [whiteScore, setWhiteScore] = useState(0);
  const [blackScore, setBlackScore] = useState(0);

  const [isWhiteTurn, setIsWhiteTurn] = useState(true);

  const [displayEndScreen, setDisplayEndScreen] = useState(false);
  const [endScreenText, setEndScreenText] = useState("");

  const [position, setPosition] = useState([
    [" ", " ", " ", " ", "k", " ", " ", " "],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    [" ", " ", " ", " ", "K", " ", " ", " "],
  ]);

  const switchTurn = () => {
    console.log("switching turn to ", !isWhiteTurn);
    setIsWhiteTurn(!isWhiteTurn);
    //setIsWhiteTurn((prevIsWhiteTurn) => !prevIsWhiteTurn);
  };

  useEffect(() => {
    socket.on("color", (data: string) => {
      console.log(data);
    });
    socket.on("position", (data) => {
      console.log("recieved position", data);
      switchTurn();
      setPosition(data);
    });
  }, [socket, isWhiteTurn]);

  const sendPosition = (position: ChessBoard) => {
    console.log("sending position", position);
    switchTurn();
    socket.emit("position", position);
  };

  const addPoint = (color: string): void => {
    if (color === "white") {
      setWhiteScore(whiteScore + 1);
    } else {
      setBlackScore(blackScore + 1);
    }
  };

  const endViaCheckmate = (color: string): void => {
    setEndScreenText(
      color === "white"
        ? "White wins via checkmate!"
        : "Black wins via checkmate!"
    );
    setDisplayEndScreen(true);

    if (color === "white") {
      console.log("White wins");
    } else {
      console.log("Black wins");
    }
  };

  const endViaStalemate = () => {
    if (whiteScore > blackScore)
      setEndScreenText("Stalemate! White wins on points!");
    if (whiteScore < blackScore)
      setEndScreenText("Stalemate! Black wins on points!");
    if (whiteScore === blackScore)
      setEndScreenText("Stalemate! Draw on points!");
    setDisplayEndScreen(true);
  };

  const endViaMaterial = () => {
    if (whiteScore > blackScore) setEndScreenText("White wins on points!");
    if (whiteScore < blackScore) setEndScreenText("Black wins on points!");
    if (whiteScore === blackScore) setEndScreenText("Draw on points!");
    setDisplayEndScreen(true);
  };

  return (
    <>
      <Button
        variant="contained"
        style={{ position: "absolute", top: "20px", left: "20px" }}
        component={Link}
        to="/"
      >
        <ArrowBackIcon />
      </Button>
      <Container>
        <Paper
          elevation={12}
          style={{ padding: 20, backgroundColor: "#bcd2da" }}
        >
          <Typography variant="h3" gutterBottom textAlign={"center"}>
            Multiplayer
          </Typography>
          <Grid container spacing={1} my={1} alignItems={"center"}>
            <Grid item>
              <MultiplayerChessboard
                addPoint={addPoint}
                endViaCheckmate={endViaCheckmate}
                endViaStalemate={endViaStalemate}
                endViaMaterial={endViaMaterial}
                sendPosition={sendPosition}
                isWhiteTurn={isWhiteTurn}
                position={position}
              />
            </Grid>
            <Grid item>
              <PlayerScores
                whiteScore={whiteScore}
                blackScore={blackScore}
                isWhiteTurn={isWhiteTurn}
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <EndScreen
        displayEndScreen={displayEndScreen}
        setDisplayEndScreen={setDisplayEndScreen}
        endScreenText={endScreenText}
      />
    </>
  );
}

export default Multiplayer;
