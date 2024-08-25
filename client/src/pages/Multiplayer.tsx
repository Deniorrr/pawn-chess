import MultiplayerChessboard from "../containers/MultiplayerChessboard.js";
import { Container, Paper, Typography, Grid, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayerScores from "../components/PlayerScores.js";
import EndScreenNew from "../components/EndScreenNew";
import Chat from "../containers/Chat.js";
import { ChessBoard, ChessCoord } from "../types/ChessBoardTypes.js";
import { PlayerTurn } from "../types/PlayerTurnType";
import { WinType } from "../types/WinType";
//import { useAlert } from "../contexts/AlertContext";
import { useSocket } from "../contexts/SocketContext";

function Multiplayer() {
  const [whiteScore, setWhiteScore] = useState(0);
  const [blackScore, setBlackScore] = useState(0);

  const [isWhiteTurn, setIsWhiteTurn] = useState(true);

  const [displayEndScreen, setDisplayEndScreen] = useState(false);
  const [winner, setWinner] = useState<PlayerTurn>("none");
  const [winType, setWinType] = useState<WinType>("material");
  const [playerColor, setPlayerColor] = useState<PlayerTurn>("none");

  const [isBoardRotated, setIsBoardRotated] = useState(false);

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

  const socketInstance = useSocket().socket;

  //const addAlert = useAlert();

  useEffect(() => {
    socketInstance.emit("getColor");

    socketInstance.on("getColor", (color: PlayerTurn) => {
      setPlayerColor(color);
      color === "black" && setIsBoardRotated(true);
    });

    socketInstance.on(
      "move",
      (data: {
        board: ChessBoard;
        scores: { white: number; black: number };
      }) => {
        setPosition(data.board);
        setWhiteScore(data.scores.white);
        setBlackScore(data.scores.black);
        switchTurn();
      }
    );

    socketInstance.on(
      "gameOver",
      (data: {
        endGameConditions: {
          gameOver: boolean;
          winner: "white" | "black" | "none";
          winType: "material" | "checkmate" | "stalemate" | "timeout"; //maybe timeout will be implemented one day
        };
        updatedData: {
          board: ChessBoard;
          scores: { white: number; black: number };
        };
      }) => {
        setPosition(data.updatedData.board);
        setWhiteScore(data.updatedData.scores.white);
        setBlackScore(data.updatedData.scores.black);
        onGameOver(
          data.endGameConditions.winner,
          data.endGameConditions.winType
        );
      }
    );

    return () => {
      socketInstance.disconnect();
    };
  }, []); // eslint-disable-line

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
    if (color === "white") {
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

  const switchBoardRotation = () => {
    setIsBoardRotated((prev) => !prev);
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
                currentTurn={isWhiteTurn ? "white" : "black"}
                board={position}
                onChangePosition={onChangePosition}
                //onGameOver={onGameOver}
                addPoint={addPoint}
                playerColor={playerColor}
                isBoardRotated={isBoardRotated}
                switchBoardRotation={switchBoardRotation}
              />
            </Grid>
            <Grid item>
              <PlayerScores
                whiteScore={whiteScore}
                blackScore={blackScore}
                isWhiteTurn={isWhiteTurn}
                playerColor={playerColor.toString()}
                isBoardRotated={isBoardRotated}
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
      <Chat />
    </>
  );
}

export default Multiplayer;
