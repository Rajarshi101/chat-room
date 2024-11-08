const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');  // Add this line

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.send('Chat server is running');
// });

io.on('connection', (socket) => {
  socket.on('join', (username) => {
    socket.username = username;
    socket.broadcast.emit('message', `${username} joined the chat`);
  });

  socket.on('chatMessage', (msg) => {
    io.emit('message', `${socket.username}: ${msg}`);
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('message', `${socket.username} left the chat`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
