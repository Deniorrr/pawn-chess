console.log("Server-side code running");

const express = require("express");
const app = express();
const { Server } = require("socket.io");
const server = require("http").createServer(app);

const cors = require("cors");
const { get } = require("http");
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const defaultRoom = {
  roomCode: "",
  players: [],
  lobbyState: {
    isPlayer1Ready: false,
    isPlayer2Ready: false,
  },
  // game state
};

const rooms = [];

io.on("connection", (client) => {
  const roomCode = client.handshake.query.roomCode;
  if (roomCode === undefined) return;

  if (!io.sockets.adapter.rooms.has(roomCode)) {
    io.sockets.adapter.rooms.set(roomCode, new Set());
    rooms.push({
      roomCode: roomCode,
      players: [client.id],
      lobbyState: {
        isPlayer1Ready: false,
        isPlayer2Ready: false,
      },
    });
  }

  client.join(roomCode);
  console.log("client connected", client.id, roomCode);

  //assign color to player
  let assignedColor = assignColor(roomCode);
  rooms.find((room) => room.roomCode === roomCode).players.push(client.id);
  client.emit("color", assignedColor);

  client.on("position", (data) => {
    client.broadcast.emit("position", data);
  });

  client.on("changedLobbyState", (data) => {
    const id = client.id;
    const room = rooms.find((room) => room.players.includes(id));
    const updatedData = room.lobbyState;
    if (getPlayersColor(room, client.id) === "white") {
      updatedData.isPlayer1Ready = !updatedData.isPlayer1Ready;
    } else {
      updatedData.isPlayer2Ready = !updatedData.isPlayer2Ready;
    }
    rooms.find((room) => room.players.includes(id)).lobbyState = updatedData;

    io.to(roomCode).emit("changedLobbyState", updatedData);
  });

  client.on("disconnect", () => {
    rooms.splice(0, rooms.length);
  });
});

app.get("/api/room", (req, res) => {
  const roomCode = generateRoomCode();
  res.send(roomCode);
});

server.listen(3000);

const assignColor = (roomCode) => {
  if (roomCode === undefined) return "spectator";
  const room = rooms.find((room) => room.roomCode === roomCode);
  if (room === undefined) return "spectator";
  if (room.players.length === 0) {
    return "white";
  } else if (room.players.length === 1) {
    return "black";
  } else {
    return "spectator";
  }
};

const getPlayersColor = (room, id) => {
  return room.players.indexOf(id) === 0 ? "white" : "black";
};

const generateRoomCode = () => {
  do {
    const roomCode = Math.random().toString(36).substr(2, 2);
    if (!io.sockets.adapter.rooms.has(roomCode)) {
      return roomCode;
    }
  } while (true);
};

//czemu spami connection?
//naprawić routing
//poprawić strukturę danych w rooms
