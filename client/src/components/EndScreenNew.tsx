import { Backdrop, Button, Grid, Typography } from "@mui/material";
import { PlayerTurn } from "../types/PlayerTurnEnum";
import { WinType } from "../types/WinTypeEnum";
import { useState, useEffect } from "react";

function EndScreenNew(props: {
  displayEndScreen: boolean;
  setDisplayEndScreen: (value: boolean) => void;
  winner: PlayerTurn;
  winType: WinType;
  score: { white: number; black: number };
}) {
  const { displayEndScreen, setDisplayEndScreen, winner, winType } = props;
  const [endScreenText, setEndScreenText] = useState("");
  const { white, black } = props.score;

  const generateEndScreenText = (): string => {
    let text = "";
    if (winner === PlayerTurn.NONE) {
      if (white > black) {
        return (text = "White Wins on Points");
      }
      if (white < black) {
        return (text = "Black Wins on Points");
      }
      return (text = "Draw");
    }
    if (winner === PlayerTurn.WHITE) text = "White Wins";
    if (winner === PlayerTurn.BLACK) text = "Black Wins";

    if (winType === WinType.CHECKMATE) text += " by Checkmate";
    if (winType === WinType.STALEMATE) text += " by Stalemate";
    if (winType === WinType.MATERIAL) {
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
      open={displayEndScreen}
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
