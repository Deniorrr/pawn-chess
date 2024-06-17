import { Paper, Typography } from "@mui/material";
import { brown } from "@mui/material/colors";

function PlayerScores(props: {
  whiteScore: number;
  blackScore: number;
  isWhiteTurn: boolean;
}) {
  const { whiteScore, blackScore, isWhiteTurn } = props;
  return (
    <>
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
        <Typography variant="h4">Black player</Typography>
      </Paper>
      <Paper
        elevation={isWhiteTurn ? 24 : 3}
        aria-label="score"
        style={{
          display: "flex",
          alignItems: "center",
          paddingRight: "10px",
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
        <Typography variant="h4">White player</Typography>
      </Paper>
    </>
  );
}

export default PlayerScores;
