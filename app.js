var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = [];

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendfile('public/lobby.html');
});

app.get('/game', function(req, res) {
  res.sendfile('public/game.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');
  clients.push(socket);
  socket.clientId = clients.length;
  console.log('...user assigned id ' + socket.clientId);
  socket.on('lobby', function(msg) {
    if (msg.indexOf('sweary')==-1) {
      console.log('message from client ' + this.clientId + ': ' + msg);
      io.emit('lobby', msg);
    } else {
      console.log('client ' + this.clientId + ' swore');
      socket.emit('lobby', 'message rejected you rudey');
    }
  });
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(process.env.PORT || 3000, function() {
  console.log('listening on *:3000');
});
