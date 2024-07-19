import Chessboard from "../containers/Chessboard.jsx";
import { Container, Paper, Typography, Grid, Button } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayerScores from "../components/PlayerScores";
import EndScreen from "../components/EndScreen";

function LocalGame() {
  const [whiteScore, setWhiteScore] = useState(0);
  const [blackScore, setBlackScore] = useState(0);

  const [isWhiteTurn, setIsWhiteTurn] = useState(true);

  const [displayEndScreen, setDisplayEndScreen] = useState(false);
  const [endScreenText, setEndScreenText] = useState("");

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
  };

  const endViaStalemate = (): void => {
    if (whiteScore > blackScore)
      setEndScreenText("Stalemate! White wins on points!");
    if (whiteScore < blackScore)
      setEndScreenText("Stalemate! Black wins on points!");
    if (whiteScore === blackScore)
      setEndScreenText("Stalemate! Draw on points!");
    setDisplayEndScreen(true);
  };

  const endViaMaterial = (): void => {
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
            Local Game
          </Typography>
          <Grid container spacing={1} my={1} alignItems={"center"}>
            <Grid item>
              <Chessboard
                addPoint={addPoint}
                endViaCheckmate={endViaCheckmate}
                endViaStalemate={endViaStalemate}
                setIsWhiteTurn={setIsWhiteTurn}
                endViaMaterial={endViaMaterial}
                isPlayingVsBot={false}
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
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={displayEndScreen}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      >
        <Grid container direction="column" alignItems="center">
          <Typography variant="h2" gutterBottom>
            {endScreenText}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setDisplayEndScreen(false)}
          >
            <Typography variant="h4">Close</Typography>
          </Button>
        </Grid>
      </Backdrop> */}
    </>
  );
}

export default LocalGame;
