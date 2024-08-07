import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Container, Paper, Typography, Grid, Button } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { useAlert } from "../contexts/AlertContext";

function MultiplayerLobby() {
  const { roomCode } = useParams();
  const addAlert = useAlert();

  const [lobbyState, setLobbyState] = useState({
    isPlayer1Ready: false,
    isPlayer2Ready: false,
  });
  const [playerNumber, setPlayerNumber] = useState(0);

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io.connect("http://localhost:3000", {
      query: { roomCode },
    });

    socketRef.current.on("connect", () => {
      console.log("connected to server");
      //addAlert("connected to server", "success");
    });

    socketRef.current.on("disconnect", () => {
      console.log("disconnected from server");
      addAlert("disconnected from server", "error");
    });

    socketRef.current.on("changedLobbyState", (data) => {
      console.log("changed lobby state", data);
      //addAlert("changed lobby state", "info");
      setLobbyState(data);
    });

    socketRef.current.on("playerNumber", (data) => {
      console.log("player number", data);
      setPlayerNumber(data);
    });

    socketRef.current.on("gameStarted", (data) => {
      console.log("game started", data);
      addAlert("game started", "info");
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomCode]);
  const switchReadyState = () => {
    socketRef.current.emit("changedLobbyState", {});
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
              Player1 {playerNumber === 1 ? "(You)" : ""}
            </Typography>
            <Typography variant="h5" gutterBottom textAlign={"center"}>
              {lobbyState.isPlayer1Ready ? "ready" : "not ready"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5" gutterBottom textAlign={"center"}>
              Player2 {playerNumber === 2 ? "(You)" : ""}
            </Typography>
            <Typography variant="h5" gutterBottom textAlign={"center"}>
              {lobbyState.isPlayer2Ready ? "ready" : "not ready"}
            </Typography>
          </Grid>
          <Grid item xs={12} display={"flex"} justifyContent={"center"}>
            <Button variant="contained" onClick={() => switchReadyState()}>
              {playerNumber === 1
                ? lobbyState.isPlayer1Ready
                  ? "Cancel"
                  : "Ready"
                : playerNumber === 2
                ? lobbyState.isPlayer2Ready
                  ? "Cancel"
                  : "Ready"
                : lobbyState.isPlayer2Ready
                ? "Cancel"
                : "Ready"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default MultiplayerLobby;
