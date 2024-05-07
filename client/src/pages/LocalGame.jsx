import Chessboard from "../components/Chessboard";
import { Container, Paper, Typography } from "@mui/material";

function LocalGame() {
  return (
    <Container>
      <Paper elevation={12} style={{ padding: 20 }}>
        <Typography variant="h3" gutterBottom textAlign={"center"}>
          Local Game
        </Typography>
        <Chessboard />
      </Paper>
    </Container>
  );
}

export default LocalGame;
