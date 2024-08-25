import { Paper, Typography, Box } from "@mui/material";
import { brown } from "@mui/material/colors";

function PlayerScores(props: {
  whiteScore: number;
  blackScore: number;
  isWhiteTurn: boolean;
  playerColor: string;
  isBoardRotated: boolean;
}) {
  const { whiteScore, blackScore, isWhiteTurn, playerColor, isBoardRotated } =
    props;
  return (
    <Box
      display={"flex"}
      flexDirection={isBoardRotated ? "column-reverse" : "column"}
    >
      <Paper
        elevation={isWhiteTurn ? 3 : 24}
        aria-label="score"
        style={{
          display: "flex",
          alignItems: "center",
          paddingRight: "10px",
          marginBottom: "10px",
          transform: isWhiteTurn ? "scale(1)" : "scale(1.05)",
          backgroundColor: isWhiteTurn ? brown[100] : brown[200],
        }}
      >
        <Paper style={{ width: "3em", textAlign: "center", margin: "15px" }}>
          <Typography variant="h4">{blackScore}</Typography>
        </Paper>
        <Typography variant="h4">
          Black player {playerColor == "black" && "(you)"}
        </Typography>
      </Paper>
      <Paper
        elevation={isWhiteTurn ? 24 : 3}
        aria-label="score"
        style={{
          display: "flex",
          alignItems: "center",
          paddingRight: "10px",
          marginBottom: "10px",
          transform: isWhiteTurn ? "scale(1.05)" : "scale(1)",
          backgroundColor: isWhiteTurn ? brown[200] : brown[100],
        }}
      >
        <Paper
          color="secondary"
          style={{ width: "3em", textAlign: "center", margin: "15px" }}
        >
          <Typography variant="h4">{whiteScore}</Typography>
        </Paper>
        <Typography variant="h4">
          White player {playerColor == "white" && "(you)"}
        </Typography>
      </Paper>
    </Box>
  );
}

export default PlayerScores;
