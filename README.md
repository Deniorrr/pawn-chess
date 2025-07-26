# Pawn-Chess

Pawn Chess is an app, where people can play a simplified and modified version of chess. You can play online in real time, against a chess engine or offline using hotseat.

## Description

Try yourself against your friend or a chess bot in the classic board game with a rule twist. There are 3 gamemodes available:
- Local hotseat mode - a standard game mode, where both players use the same device to play.
- Game vs bot - a game against the famous Stockfish chess engine. It may seem impossible, however the chess engine doesn't know about the changed rules, so there are ways to outsmart it.
- Online game - you can either create or join a online lobby and play against your friend. This mode has also a text chat window for communicating with the opponent.

#### Game rules

The initial board contains all pawns and and both kings placed just like in the regular game. You earn points by delivering your pawns to the promotion rank,
but the pawns disappear after getting there. The goal is to end the game with more points at the end of the game or checkmate your opponent.


## Tech stack
[![TypeScript][TypeScript]][TypeScript-url]
[![React.js][React.js]][React-url]
[![Node.js][Node.js]][Node-url]
[![Express.js][Express.js]][Express-url]
[![Socket.io][Socket.io]][Socket-url]

This project contains a frontend app and a backend server. The server is used for the online game mode. Additionally the **Game vs Bot** gamemode uses an external API to handle the bot moves - https://stockfish.online/

## Setup

To run the project, install the frontend and backend part locally using npm:
```
$ cd /pawn-chess
$ cd /client
$ npm install
$ cd ..
$ cd /server
$ npm install
```
Then run both client and server instances in two separate terminals, by using:
```
$ npm run dev
```


## License

[MIT](https://choosealicense.com/licenses/mit/)

<!-- LINKS  -->

[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/

[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/

[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/

[Socket.io]: https://img.shields.io/badge/Socket.io-239179?style=for-the-badge&logo=socket.io&logoColor=white
[Socket-url]: https://socket.io/
