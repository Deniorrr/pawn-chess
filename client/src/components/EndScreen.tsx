import { Backdrop, Button, Grid, Typography } from "@mui/material";

function EndScreen(props: {
  displayEndScreen: boolean;
  setDisplayEndScreen: (value: boolean) => void;
  endScreenText: string;
}) {
  const { displayEndScreen, setDisplayEndScreen, endScreenText } = props;

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

export default EndScreen;
