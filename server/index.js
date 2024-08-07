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

io.on("connection", (client) => {
  const roomCode = client.handshake.query.roomCode;
  if (roomCode === undefined) return;
  let playerNumber = 2;
  if (!rooms.roomExists(roomCode)) {
    io.sockets.adapter.rooms.set(roomCode, new Set());
    rooms.addRoom(roomCode);
    playerNumber = 1;
  }
  rooms.addPlayer(roomCode, client.id);
  client.join(roomCode);
  //send to player the color
  client.emit("playerNumber", playerNumber);

  client.on("changedLobbyState", () => {
    const roomCode = rooms.findRoom(client.id);
    const newLobbyState = rooms.changeLobbyState(roomCode, client.id);
    io.to(roomCode).emit("changedLobbyState", newLobbyState);
  });

  client.on("disconnect", () => {
    rooms.disconnectPlayer(client.id);
  });
});

app.get("/api/room", (req, res) => {
  const roomCode = rooms.generateRoomCode();
  res.send(roomCode);
});

console.log("Server running on port 3000");
server.listen(3000);
