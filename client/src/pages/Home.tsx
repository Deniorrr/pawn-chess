import {
  Button,
  Paper,
  Box,
  Container,
  Typography,
  Input,
} from "@mui/material";
import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const generateRoomCode = async (): Promise<string> => {
    return axios
      .get("http://localhost:3000/api/room")
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
      });
    //return Math.random().toString(36).substr(2, 4); //soon api call
  };

  const [roomCode, setRoomCode] = useState<string>("");

  const handleCreateRoom = async () => {
    const newRoomCode: string = await generateRoomCode();
    if (newRoomCode) {
      navigate(`/lobby/${newRoomCode}`);
    }
  };

  return (
    <Container
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#bcd2da",
      }}
    >
      <Box display={"flex"}>
        <Typography variant="h2" gutterBottom>
          Welcome to&nbsp;
        </Typography>
        <Typography variant="h2" gutterBottom color={"primary"}>
          Pawn Chess♟
        </Typography>
      </Box>
      <Paper elevation={3}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          padding={5}
          gap={2}
        >
          <Button
            component={Link}
            to="/local-game"
            variant="contained"
            size="large"
          >
            <Typography variant="h4">Local Game</Typography>
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="/stockfish"
            size="large"
            color="primary"
          >
            <Typography variant="h4">Play VS BOT</Typography>
          </Button>
          <Button variant="contained" size="large" onClick={handleCreateRoom}>
            <Typography variant="h4">Create room</Typography>
          </Button>

          <Button
            variant="contained"
            size="large"
            component={Link}
            to={`/lobby/${roomCode}`}
          >
            <Typography variant="h4">Join room</Typography>
          </Button>
          <Input
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
        </Box>
      </Paper>
      <Outlet />
      <Typography variant="body1" color="textSecondary">
        &copy; 2024 Denis Poczęty
      </Typography>
    </Container>
  );
}

export default Home;
