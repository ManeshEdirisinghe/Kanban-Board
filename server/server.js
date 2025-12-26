// Simple Node.js + Socket.IO server for real-time Kanban collaboration
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let boardState = null; // Store the latest board state

io.on('connection', (socket) => {
  // Send current board state to new client
  if (boardState) {
    socket.emit('board-update', boardState);
  }

  // Listen for board changes from clients
  socket.on('board-update', (data) => {
    boardState = data;
    socket.broadcast.emit('board-update', data);
  });

  // Optional: user presence
  socket.on('user-joined', (user) => {
    socket.broadcast.emit('user-joined', user);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
