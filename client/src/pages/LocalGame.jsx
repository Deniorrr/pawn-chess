import Chessboard from "../components/Chessboard";
import { Container, Paper, Typography, Grid } from "@mui/material";
import { useState } from "react";

function LocalGame() {
  const [whiteScore, setWhiteScore] = useState(0);
  const [blackScore, setBlackScore] = useState(0);

  const addPoint = (color) => {
    if (color === "white") {
      setWhiteScore(whiteScore + 1);
    } else {
      setBlackScore(blackScore + 1);
    }
  };

  return (
    <Container>
      <Paper elevation={12} style={{ padding: 20 }}>
        <Typography variant="h3" gutterBottom textAlign={"center"}>
          Local Game
        </Typography>
        <Grid container spacing={1} my={1}>
          <Grid item>
            <Chessboard addPoint={addPoint} />
          </Grid>
          <Grid item>
            <Paper elevation={3} aria-label="scores">
              <Typography variant="h4" gutterBottom>
                White: {whiteScore}
              </Typography>
              <Typography variant="h4" gutterBottom>
                Black: {blackScore}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default LocalGame;
