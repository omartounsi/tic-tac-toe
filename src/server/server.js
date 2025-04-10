import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let rooms = {};

io.on("connection", (socket) => {
  console.log("user connected: ", socket.id);

  // join
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    // console.log(rooms);
    if (!rooms[roomId]) {
      rooms[roomId] = { board: Array(9).fill(null), isXNext: true };
    }
    io.to(roomId).emit("updateGame", rooms[roomId]);
  });

  //move
  socket.on("makeMove", ({ roomId, index }) => {
    const room = rooms[roomId];
    if (room && !room.board[index]) {
      room.board[index] = room.isXNext ? "X" : "O";
      room.isXNext = !room.isXNext;
      console.log("update board state:", room.board);

      //emit to all clients
      io.to(roomId).emit("updateGame", room);
    }
    //checkwin
    const winner = checkWin(room.board);
    if (winner) {
      io.to(roomId).emit("gameOver", { winner });
      console.log("GAME OVER");

      delete rooms[roomId];
    } else {
      io.to(roomId).emit("updateGame", room);
    }
  });

  //disconnect
  socket.on("disconnect", () => {
    console.log("user disconnectedd: ", socket.id);
  });
});

function checkWin(board) {
  const winningIndex = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let combination of winningIndex) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

const port = 3002;
server.listen(port, () => {
  console.log("listening on ", port);
});
