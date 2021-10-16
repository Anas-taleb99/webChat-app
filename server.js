const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMsg = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/user');

const app = express();
const server = http.createServer(app);

// pass the server to the socket.io
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

// Run when client connects
io.on('connection', socket => {
  
  socket.on('joinRoom', ({ username, room}) => {

    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // this run to a single client when he connects
    socket.emit('message', formatMsg(botName, `welcome to chatCord`));
  
    // this run to all clients except one client who connects
    socket.broadcast.to(user.room).emit('message',  formatMsg(botName, `${user.username} has joined the chat`));

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    })
  })
  
  
  // listent for a message
  socket.on('chatMessage', msg => {
    console.log(msg);
    const user = userLeave(socket.id);
    
    // Send back the message to all users in the same route
    io.to(user.room).emit('message',  formatMsg(user.username, msg));
  })

  // this runs when client disconnets 
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      // this runs for all users
      io.emit('message', formatMsg(botName, `${user.username} has left the chat`));

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      })
    }

  })

})

const port = '5000' || process.env.PORT;

server.listen(port, () => console.log(`server runner in ${port}`))