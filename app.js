var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Session = require('express-session');
var SessionStore = require('session-file-store')(Session);
var session = Session({
      store: new SessionStore({ path: './tmp/sessions' }),
      secret: 'secreshizzle',
      resave: true,
      saveUninitialized: true
    });
    

app.use(session);

app.use(express.static('public'));

app.get('/', function(req, res) {
  checkSessionId(req);
  res.sendfile('public/lobby.html');
});

app.get('/game', function(req, res) {
  checkSessionId(req);
  res.sendfile('public/game.html');
});

io.use(function(socket, next) {
  session(socket.handshake, {}, next);
});

io.on('connection', function(socket) {
  var uid = socket.handshake.session.uid;
  console.log('io connection started using session id ' + uid);
 
  socket.on('lobby', function(msg) {
    if (msg.indexOf('sweary')==-1) {
      console.log('message from client ' + uid + ': ' + msg);
      io.emit('lobby', msg);
    } else {
      console.log('client ' + uid + ' swore');
      socket.emit('lobby', 'message rejected you rudey');
    }
  });
  
  socket.on('game', function(msg) {
    var uid = socket.handshake.session.uid;
    console.log('game message from client ' + uid + ': ' + msg);
    io.emit('game', msg);
  });
  
  socket.on('disconnect', function() {
    console.log('io disconnect with session id ' + socket.handshake.session.uid);
  });
});

http.listen(process.env.PORT || 3000, function() {
  console.log('listening on *:3000');
});

function checkSessionId(req) {
  if (req.session.uid) {
    console.log('request using active session ' + req.session.uid);
  } else {
    req.session.uid = Date.now();
    console.log('new session! assigned id ' + req.session.uid);
  }
}