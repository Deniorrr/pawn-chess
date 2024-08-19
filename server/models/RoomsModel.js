const initialBoard = require("../constants/initialBoard");

class Rooms {
  constructor() {
    this.data = {};
  }
  addRoom(roomCode) {
    this.data[roomCode] = {
      roomCode: roomCode,
      players: [],
      lobbyState: {
        isPlayer1Ready: false,
        isPlayer2Ready: false,
      },
      hasGameStarted: false,
      board: initialBoard,
    };
  }

  addPlayer(roomCode, player) {
    this.data[roomCode].players.push(player);
  }

  findRoom(playerId) {
    const room = Object.values(this.data).find((room) =>
      room.players.includes(playerId)
    );
    return room ? room.roomCode : undefined;
  }

  generateRoomCode() {
    do {
      const roomCode = Math.random().toString(36).substr(2, 2);
      if (!this.roomExists(roomCode)) {
        return roomCode;
      }
    } while (true);
  }

  roomExists(roomCode) {
    return this.data.hasOwnProperty(roomCode);
  }

  getPlayersColor(roomCode, playerId) {
    return this.data[roomCode].players.indexOf(playerId) === 0
      ? "white"
      : "black";
  }

  changeLobbyState(roomCode, playerId) {
    try {
      const room = this.data[roomCode];
      const updatedData = room.lobbyState;
      if (this.getPlayersColor(roomCode, playerId) === "white") {
        updatedData.isPlayer1Ready = !updatedData.isPlayer1Ready;
      } else {
        updatedData.isPlayer2Ready = !updatedData.isPlayer2Ready;
      }
      room.lobbyState = updatedData;
      if (updatedData.isPlayer1Ready && updatedData.isPlayer2Ready) {
        room.hasGameStarted = true;
      }
      return room;
    } catch (error) {
      console.log(error);
    }
  }

  updateBoard(roomCode, newBoard) {
    this.data[roomCode].board = newBoard;
  }

  disconnectPlayer(playerId) {
    const roomCode = this.findRoom(playerId);
    if (!roomCode) {
      return;
    }
    this.data[roomCode].players = this.data[roomCode].players.filter(
      (player) => player !== playerId
    );
    this.data[roomCode].lobbyState = {
      isPlayer1Ready: false,
      isPlayer2Ready: false,
    };
  }
  deleteRoom(roomCode) {
    delete this.data[roomCode];
  }
}

module.exports = Rooms;
