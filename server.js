const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users
const users = new Map();
const messages = [];

// Handle socket connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user join
  socket.on('user-join', (username) => {
    users.set(socket.id, username);
    
    // Send existing messages to new user
    socket.emit('message-history', messages);
    
    // Broadcast user joined
    socket.broadcast.emit('user-joined', {
      username,
      message: `${username} joined the chat! 🎉`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'system'
    });

    // Send updated user count
    io.emit('user-count', users.size);
    
    console.log(`${username} joined the chat`);
  });

  // Handle new message
  socket.on('send-message', (data) => {
    const username = users.get(socket.id);
    if (username) {
      const messageData = {
        username,
        message: data.message,
        timestamp: new Date().toLocaleTimeString(),
        type: 'user',
        socketId: socket.id
      };

      // Store message in history
      messages.push(messageData);
      
      // Keep only last 50 messages
      if (messages.length > 50) {
        messages.shift();
      }

      // Broadcast message to all users
      io.emit('new-message', messageData);
      
      console.log(`${username}: ${data.message}`);
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const username = users.get(socket.id);
    if (username) {
      socket.broadcast.emit('user-typing', {
        username,
        typing: data.typing
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      users.delete(socket.id);
      
      // Broadcast user left
      socket.broadcast.emit('user-left', {
        username,
        message: `${username} left the chat 👋`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'system'
      });

      // Send updated user count
      io.emit('user-count', users.size);
      
      console.log(`${username} left the chat`);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Chat server running on http://localhost:${PORT}`);
});