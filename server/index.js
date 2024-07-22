console.log("Server-side code running");

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const cors = require("cors");
const e = require("cors");
const { emit } = require("process");
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const players = [];

io.on("connection", (client) => {
  //assign color to player
  let assignedColor = assignColor();
  players.push({ id: client.id, color: assignedColor });
  client.emit("color", assignedColor);

  client.on("position", (data) => {
    client.broadcast.emit("position", data);
  });

  // client.on("join", (data) => {
  //   console.log(data);
  //   client.join(data.room);
  // });

  // client.on("event", (data) => {
  //   console.log(data);
  // });
  client.on("disconnect", () => {
    players.splice(0, players.length);
  });
});

server.listen(3000);

const assignColor = () => {
  if (players.length === 0) return "white";
  if (players.length === 1) return "black";
  return "spectator";
};
