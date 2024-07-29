import { useParams } from "react-router-dom";
import { useEffect } from "react";
import io from "socket.io-client";
import { Container, Paper, Typography, Grid, Button } from "@mui/material";
import { useState } from "react";

function MultiplayerLobby() {
  const { roomCode } = useParams();
  const [lobbyState, setLobbyState] = useState({
    isPlayer1Ready: false,
    isPlayer2Ready: false,
  });

  const socket = io.connect("http://localhost:3000", {
    query: { roomCode },
  });

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server");
    });

    socket.on("changedLobbyState", (data) => {
      console.log("changed lobby state", data);
      setLobbyState(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomCode]);
  const switchReadyState = () => {
    socket.emit("changedLobbyState", {});
  };

  return (
    <Container style={{ marginTop: "23px" }}>
      <Paper elevation={12} style={{ padding: 20, backgroundColor: "#bcd2da" }}>
        <Typography variant="h3" gutterBottom textAlign={"center"}>
          Local Game
        </Typography>

        <Grid container rowGap={10} marginTop={10}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom textAlign={"center"}>
              Room Code: {roomCode}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5" gutterBottom textAlign={"center"}>
              Player1
            </Typography>
            <Typography variant="h5" gutterBottom textAlign={"center"}>
              {lobbyState.isPlayer1Ready ? "ready" : "not ready"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5" gutterBottom textAlign={"center"}>
              Player2
            </Typography>
            <Typography variant="h5" gutterBottom textAlign={"center"}>
              {lobbyState.isPlayer2Ready ? "ready" : "not ready"}
            </Typography>
          </Grid>
          <Grid item xs={12} display={"flex"} justifyContent={"center"}>
            <Button variant="contained" onClick={() => switchReadyState()}>
              {lobbyState.isPlayer1Ready ? "Cancel" : "Ready"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default MultiplayerLobby;
