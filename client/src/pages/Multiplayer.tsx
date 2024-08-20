import MultiplayerChessboard from "../containers/MultiplayerChessboard.js";
import { Container, Paper, Typography, Grid, Button } from "@mui/material";
import { useEffect, useState } from "react";
//import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayerScores from "../components/PlayerScores.js";
import EndScreenNew from "../components/EndScreenNew";
import { ChessBoard, ChessCoord } from "../types/ChessBoardTypes.js";
import { PlayerTurn } from "../types/PlayerTurnEnum";
import { WinType } from "../types/WinTypeEnum";
import { useAlert } from "../contexts/AlertContext";
import { useSocket } from "../contexts/SocketContext";

function Multiplayer() {
  const [whiteScore, setWhiteScore] = useState(0);
  const [blackScore, setBlackScore] = useState(0);

  const [isWhiteTurn, setIsWhiteTurn] = useState(true);

  const [displayEndScreen, setDisplayEndScreen] = useState(false);
  const [winner, setWinner] = useState<PlayerTurn>(PlayerTurn.NONE);
  const [winType, setWinType] = useState<WinType>(WinType.MATERIAL);
  const [playerColor, setPlayerColor] = useState<PlayerTurn>(PlayerTurn.NONE);

  const [position, setPosition] = useState<ChessBoard>([
    [" ", " ", " ", " ", "k", " ", " ", " "],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    [" ", " ", " ", " ", "K", " ", " ", " "],
  ]);

  // const [position, setPosition] = useState<ChessBoard>([
  //   [" ", " ", " ", " ", "k", " ", " ", " "],
  //   [" ", " ", " ", " ", "p", "P", " ", " "],
  //   [" ", " ", " ", "P", "K", " ", " ", " "],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  //   [" ", " ", " ", " ", " ", " ", " ", " "],
  // ]);

  const socketInstance = useSocket().socket;

  const addAlert = useAlert();

  useEffect(() => {
    socketInstance.emit("getColor");

    socketInstance.on("getColor", (color: PlayerTurn) => {
      setPlayerColor(color);
    });

    socketInstance.on("move", (data: ChessBoard) => {
      setPosition(data);
      switchTurn();
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const switchTurn = () => {
    setIsWhiteTurn((prevIsWhiteTurn) => !prevIsWhiteTurn);
  };

  const onChangePosition = (
    from: ChessCoord,
    to: ChessCoord,
    chessboard: ChessBoard
  ) => {
    setPosition(chessboard);
    socketInstance.emit("move", { from, to });
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
                board={position}
                onChangePosition={onChangePosition}
                onGameOver={onGameOver}
                addPoint={addPoint}
                playerColor={playerColor}
              />
            </Grid>
            <Grid item>
              <PlayerScores
                whiteScore={whiteScore}
                blackScore={blackScore}
                isWhiteTurn={isWhiteTurn}
                playerColor={playerColor.toString()}
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
        />
      )}
    </>
  );
}

export default Multiplayer;
