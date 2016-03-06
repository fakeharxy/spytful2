var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendfile('public/lobby.html');
});

app.get('/game', function(req, res) {
  res.sendfile('public/index.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('lobby', function(msg) {
    console.log('message: ' + msg);
    io.emit('lobby', msg);
  });
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(process.env.PORT || 3000, function() {
  console.log('listening on *:3000');
});
