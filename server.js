const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');

const app = express();
const server = http.Server(app);
const io = new Server(server);
const port = process.env.PORT || 4000;

// PeerJS server setup
const peer = ExpressPeerServer(server, { debug: true });
app.use('/peerjs', peer);

// EJS setup and static files
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`); // Redirect to a unique room ID
});

app.get('/:room', (req, res) => {
  res.render('index', { RoomId: req.params.room }); // Render room with ID
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('New socket connection established');

  socket.on('newUser', (id, room) => {
    console.log(`User ID: ${id} joined Room: ${room}`);
    socket.join(room);

    // Notify other users in the room
    socket.to(room).emit('userJoined', id);

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log(`User ID: ${id} disconnected`);
      socket.to(room).emit('userDisconnect', id);
    });
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
