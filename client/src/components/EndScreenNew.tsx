import { Backdrop, Button, Grid, Typography } from "@mui/material";
import { PlayerTurn } from "../types/PlayerTurnType";
import { WinType } from "../types/WinType";
import { useState, useEffect } from "react";

function EndScreenNew(props: {
  setDisplayEndScreen: (value: boolean) => void;
  winner: PlayerTurn;
  winType: WinType;
  score: { white: number; black: number };
}) {
  const { setDisplayEndScreen, winner, winType } = props;
  const [endScreenText, setEndScreenText] = useState("");
  const { white, black } = props.score;

  const generateEndScreenText = (): string => {
    let text = "";
    if (winner === "none") {
      console.log("white", white, "black", black);
      if (white > black) {
        return (text = "White Wins on Points");
      }
      if (white < black) {
        return (text = "Black Wins on Points");
      }
      return (text = "Draw");
    }
    if (winner === "white") text = "White Wins";
    if (winner === "black") text = "Black Wins";

    if (winType === "checkmate") text += " by Checkmate";
    if (winType === "stalemate") text += " by Stalemate";
    if (winType === "material") {
      text += " by Material ";
    }
    return text;
  };

  useEffect(() => {
    setEndScreenText(generateEndScreenText());
  }, [winner, winType]);

  return (
    <Backdrop
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)", color: "#fff" }}
    >
      <Grid container direction="column" alignItems="center">
        <Typography variant="h2" gutterBottom>
          {endScreenText}
        </Typography>
        <Button variant="contained" onClick={() => setDisplayEndScreen(false)}>
          <Typography variant="h4">Close</Typography>
        </Button>
      </Grid>
    </Backdrop>
  );
}

export default EndScreenNew;
