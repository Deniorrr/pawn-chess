import MultiplayerChessboard from "../containers/MultiplayerChessboard.js";
import { Container, Paper, Typography, Grid, Button } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayerScores from "../components/PlayerScores.js";
import EndScreenNew from "../components/EndScreenNew";
import io from "socket.io-client";
import { ChessBoard } from "../types/ChessBoardTypes.js";
import { PlayerTurn } from "../types/PlayerTurnEnum";
import { WinType } from "../types/WinTypeEnum";
import { useAlert } from "../contexts/AlertContext";

function Multiplayer() {
  const [whiteScore, setWhiteScore] = useState(0);
  const [blackScore, setBlackScore] = useState(0);

  const [isWhiteTurn, setIsWhiteTurn] = useState(true);

  const [displayEndScreen, setDisplayEndScreen] = useState(false);
  //const [endScreenText, setEndScreenText] = useState("");
  const [winner, setWinner] = useState<PlayerTurn>(PlayerTurn.NONE);
  const [winType, setWinType] = useState<WinType>(WinType.MATERIAL);

  // const [position, setPosition] = useState<ChessBoard>([
  //   [" ", " ", " ", " ", "k", " ", " ", " "],
  //   ["p", "p", "p", "p", "p", "p", "p", "p"],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  //   ["P", "P", "P", "P", "P", "P", "P", "P"],
  //   [" ", " ", " ", " ", "K", " ", " ", " "],
  // ]);

  const [position, setPosition] = useState<ChessBoard>([
    [" ", " ", " ", " ", "k", " ", " ", " "],
    [" ", " ", " ", " ", "p", "P", " ", " "],
    [" ", " ", " ", "P", "K", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
  ]);

  const socketRef = useRef(null);
  const { roomCode } = useParams();
  const addAlert = useAlert();

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:3000", {
      query: { roomCode },
    });

    socketRef.current.on("connect", () => {
      console.log("connected to server");
      addAlert("connected to server", "success");
    });

    socketRef.current.on("disconnect", () => {
      console.log("disconnected from server");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomCode]);
  const switchTurn = () => {
    //console.log("switching turn to ", !isWhiteTurn);
    //setIsWhiteTurn(!isWhiteTurn);
    setIsWhiteTurn((prevIsWhiteTurn) => !prevIsWhiteTurn);
  };

  // useEffect(() => {
  //   socket.on("color", (data: string) => {
  //     console.log(data);
  //   });
  //   socket.on("position", (data) => {
  //     console.log("recieved position", data);
  //     switchTurn();
  //     setPosition(data);
  //   });
  // }, [socket, isWhiteTurn]);

  const onChangePosition = (position: ChessBoard) => {
    setPosition(position);
    switchTurn();
    // send position to server
    // recieve position and turn from server

    // console.log("sending position", position);
    // switchTurn();
    // socket.emit("position", position);
  };

  const addPoint = (color: PlayerTurn): void => {
    if (color === PlayerTurn.WHITE) {
      setWhiteScore(whiteScore + 1);
    } else {
      setBlackScore(blackScore + 1);
    }
  };

  const onGameOver = (winner: PlayerTurn, winType: WinType) => {
    setWinner(winner);
    setWinType(winType);
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
                currentTurn={isWhiteTurn ? PlayerTurn.WHITE : PlayerTurn.BLACK}
                position={position}
                onChangePosition={onChangePosition}
                onGameOver={onGameOver}
                addPoint={addPoint}
                // endViaCheckmate={endViaCheckmate}
                // endViaStalemate={endViaStalemate}
                // endViaMaterial={endViaMaterial}
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
      {displayEndScreen && (
        <EndScreenNew
          winner={winner}
          winType={winType}
          score={{ white: whiteScore, black: blackScore }}
          setDisplayEndScreen={setDisplayEndScreen}
          //endScreenText={endScreenText}
        />
      )}
    </>
  );
}

export default Multiplayer;
