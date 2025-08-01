const express = require("express");
const app = express();
const { Server } = require("socket.io");
const server = require("http").createServer(app);

const cors = require("cors");
app.use(cors());

const Rooms = require("./models/RoomsModel");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const rooms = new Rooms();
const checkEndGameConditions = require("./utils/gameLogic/checkEndGameConditions");

//backend endpoint naming conventions

io.on("connection", (client) => {
  const roomCode = client.handshake.query.roomCode;
  if (roomCode === undefined) {
    console.log("No room code provided");
    client.disconnect();
    return;
  }
  let playerNumber = 2;
  if (!rooms.roomExists(roomCode)) {
    io.sockets.adapter.rooms.set(roomCode, new Set());
    rooms.addRoom(roomCode);
    playerNumber = 1;
  }
  rooms.addPlayer(roomCode, client.id);
  client.join(roomCode);
  client.emit("changedLobbyState", rooms.data[roomCode].lobbyState);
  //send to player the color
  client.emit("playerNumber", playerNumber);
  client.broadcast.to(roomCode).emit("playerJoined");

  client.on("changedLobbyState", () => {
    const roomCode = rooms.findRoom(client.id);
    const newRoomState = rooms.changeLobbyState(roomCode, client.id);
    io.to(roomCode).emit("changedLobbyState", newRoomState.lobbyState);
    if (newRoomState.hasGameStarted) {
      io.to(roomCode).emit("gameStarted");
    }
  });

  client.on("getColor", () => {
    const roomCode = rooms.findRoom(client.id);
    const color = rooms.getPlayersColor(roomCode, client.id);
    client.emit("getColor", color);
  });

  client.on("message", (text) => {
    if (text === "") return;
    const roomCode = rooms.findRoom(client.id);
    const playerColor = rooms.getPlayersColor(roomCode, client.id);
    const messageTime = new Date().toLocaleTimeString();
    rooms.addMessage(roomCode, { text, playerColor, messageTime });
    io.to(roomCode).emit("message", { text, playerColor, messageTime });
  });

  client.on("getMessages", () => {
    const roomCode = rooms.findRoom(client.id);
    const messages = rooms.getMessages(roomCode);
    client.emit("getMessages", messages);
  });

  client.on("move", (moveData) => {
    const roomCode = rooms.findRoom(client.id);
    const playerColor = rooms.getPlayersColor(roomCode, client.id);
    if (playerColor === "black" && rooms.data[roomCode].isWhiteTurn) return;
    if (playerColor === "white" && !rooms.data[roomCode].isWhiteTurn) return;

    rooms.executeMove(roomCode, moveData);
    const updatedData = rooms.getGameData(roomCode);

    const endGameConditions = checkEndGameConditions(
      updatedData.board,
      updatedData.isWhiteTurn
    );
    //example return: { gameOver: true, winner: "none", winType: "material" };
    if (endGameConditions.gameOver) {
      io.to(roomCode).emit("gameOver", { endGameConditions, updatedData });
    }
    io.to(roomCode).emit("move", updatedData);
  });

  client.on("disconnect", () => {
    const roomCode = rooms.findRoom(client.id);
    rooms.disconnectPlayer(client.id);
    if (!rooms.data[roomCode]) {
      return;
    }
    if (rooms.data[roomCode].players.length === 0) {
      io.sockets.adapter.rooms.delete(roomCode);
      return rooms.deleteRoom(roomCode);
    }
    client.leave(roomCode);
    io.to(roomCode).emit("changedLobbyState", rooms.data[roomCode].lobbyState);
    io.to(roomCode).emit("playerNumber", 1);
  });
});

app.get("/api/room", (req, res) => {
  const roomCode = rooms.generateRoomCode();
  res.send(roomCode);
});

console.log("Server running on port 3000");
server.listen(3000);
