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
        
var players = [];

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
  if (players[uid]) { //check the player is still in memory
 
    socket.on('setname', function(newname) {
      var uid = this.handshake.session.uid;
      var oldname = players[uid].name;
      console.log('setname from uid ' + uid + ' (' + oldname + ' -> ' + newname + ')');
      players[uid].name = newname;
      io.emit('lobby', oldname + ' changed name to ' + newname);
    });
    
    socket.on('getname', function() {
      var uid = this.handshake.session.uid;
      console.log('getname from uid ' + uid + ' (' + players[uid].name + ')');
      socket.emit('setname', players[uid].name);
    });
    
    socket.on('lobby', function(msg) {
      var uid = this.handshake.session.uid;
      if (msg.indexOf('sweary')==-1) {
        console.log('lobby message from client ' + uid + ' (' + players[uid].name + ') : ' + msg);
        io.emit('lobby', players[uid].name + ': ' + msg);
      } else {
        console.log('client ' + uid + ' swore');
        socket.emit('lobby', 'message rejected you rudey');
      }
    });
    
    socket.on('game', function(msg) {
      var uid = this.handshake.session.uid;
      console.log('game message from client ' + uid + ' (' + players[uid].name + '): ' + msg);
      io.emit('game', players[uid].name + ': ' + msg);
    });
    
    socket.on('disconnect', function() {
      console.log('io disconnect with session id ' + this.handshake.session.uid);
    });
    
  } else {
    console.log("(session no longer active; connection ignored)");
  }
});

http.listen(process.env.PORT || 3000, function() {
  console.log('listening on *:3000');
});

function checkSessionId(req) {
  if (req.session.uid && players[req.session.uid]) {
    console.log('request using active session ' + req.session.uid + " (" + players[req.session.uid].name + ")");
  } else {
    var uid = Date.now();
    req.session.uid = uid;
    var newplayer = { name: "annnnnonnn" };
    players[uid] = newplayer;
    console.log('new session! assigned id ' + uid);
  }
}