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
        
        
        
var Game = require('./private/game.js');

var clients = []; // this is the list of connected clients
var game;

app.use(session);

app.use(express.static('public'));

app.get('/', function(req, res) {
  checkSessionId(req);
  res.sendfile('public/lobby.html');
});

app.get('/game', function(req, res) {
  if(checkSessionId(req)) {
    if (!game) {
      //need to create a game
      game = Object.create(Game);
      game.setup(5, 5);
    }
    res.sendfile('public/game.html');
  } else {
    //redirect to lobby if session is invalid
    res.sendfile('public/lobby.html');
  }
});

io.use(function(socket, next) {
  session(socket.handshake, {}, next);
});

io.on('connection', function(socket) {
  var uid = socket.handshake.session.uid;
  console.log('io connection started using session id ' + uid);
  if (clients[uid]) { //check the client is still in memory
 
    socket.on('setname', function(newname) {
      var uid = this.handshake.session.uid;
      var oldname = clients[uid].name;
      console.log('setname from uid ' + uid + ' (' + oldname + ' -> ' + newname + ')');
      clients[uid].name = newname;
      io.emit('lobby', oldname + ' changed name to ' + newname);
    });
    
    socket.on('getname', function() {
      var uid = this.handshake.session.uid;
      console.log('getname from uid ' + uid + ' (' + clients[uid].name + ')');
      socket.emit('setname', clients[uid].name);
    });
    
    socket.on('lobby', function(msg) {
      var uid = this.handshake.session.uid;
      //if (msg.indexOf('sweary')==-1) {
        console.log('lobby message from client ' + uid + ' (' + clients[uid].name + ') : ' + msg);
        io.emit('lobby', clients[uid].name + ': ' + msg);
      //} else {
      //  console.log('client ' + uid + ' swore');
      //  socket.emit('lobby', 'message rejected you rudey');
      //}
    });
    
    socket.on('game', function(msg) {
      var uid = this.handshake.session.uid;
      console.log('game message from client ' + uid + ' (' + clients[uid].name + '): ' + msg);
      io.emit('game', clients[uid].name + ': ' + msg);
    });
    
    socket.on('disconnect', function() {
      var uid = this.handshake.session.uid;
      console.log('io disconnect with session id ' + uid);
    });
    
    socket.on('requestGame', function() {
      if (game) {
        console.log("sending game state to client with id " + this.handshake.session.uid);
        socket.emit('gameState', game.getObjectForClient());
      }
    });
    
    socket.on('ready', function() {
      if (game) {
        var uid = this.handshake.session.uid;
        console.log('client with id ' + uid + ' has pressed ready');
        if (game.addPlayer(uid, clients[uid].name)) {
          io.emit('game', clients[uid].name + " is ready to play");
          io.emit('gameUpdate', { players: game.players });
        } else {
          socket.emit('game', "you can't say you're ready for the game now");
        }
      }
    });
    
    socket.on('startGame', function() {
      if (game) {
        var uid = this.handshake.session.uid;
        console.log('client with id ' + uid + ' has pressed start game');
        if (game.isPlayer(uid)) {
          if (game.prepareGame()) {
            io.emit('game', clients[uid].name + ' starts the game');
            io.emit('gameUpdate', { state: game.state,
                                    deck: game.deck.getObjectForClient() //TODO: find a neater way to update small deck changes without sending all the cards
                                  }); //TODO: what else????
          } else {
            socket.emit('game', 'could not start the game');
          }
        } else {
          socket.emit('game', "you aren't a player so you can't start the game");
        }
      }
    });
    
  } else {
    console.log("(session no longer active; connection ignored)"); //should send an expiration message to client to refresh the page
  }
});

http.listen(process.env.PORT || 3000, function() {
  console.log('listening on *:3000');
});

function checkSessionId(req) {
  if (req.session.uid && clients[req.session.uid]) {
    console.log('request using active session ' + req.session.uid + " (" + clients[req.session.uid].name + ")");
    return true;
  } else {
    var uid = Date.now();
    req.session.uid = uid;
    var newplayer = { name: "annnnnonnn" };
    clients[uid] = newplayer;
    console.log('new session! assigned id ' + uid);
    return false;
  }
}