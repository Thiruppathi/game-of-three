const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const GameOfThree = require("./gameOfThree");
const app = express();
const clientPath = `${__dirname}/client`;
console.log("Serving Application UI from ", clientPath);

const MIN = 3;
const MAX = 21;

app.use(express.static(clientPath)); // Serve Static Files

const server = http.createServer(app);

const io = socketio(server);
let isWaitingPlayer = null;
let startingNumber = getRandomIntInclusive(MIN, MAX);

io.on("connection", sock => {
  if (isWaitingPlayer) {
    new GameOfThree(isWaitingPlayer, sock, startingNumber); // start a game
    isWaitingPlayer = null;
  } else {
    isWaitingPlayer = sock;
    isWaitingPlayer.emit("message", "Waiting for Player 2");
  }

  sock.on("message", text => {
    console.log("on text", text);
    io.emit("message", text);
  });
});

server.listen(8080, () => {
  console.log("Game of Three Started on 8080");
});

server.on("error", err => {
  console.error("Server Error: ", err);
});

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  result = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(result);
  return result;
}
