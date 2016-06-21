var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Session = require('express-session');
var SessionStore = require('session-file-store')(Session);
var session = Session({
  store: new SessionStore({
    path: './tmp/sessions'
  }),
  secret: 'secreshizzle',
  resave: true,
  saveUninitialized: true
});



var Game = require('./private/game.js');
var Rules = require('./private/rules.js');

var clients = []; // map of connected clients; key is client id
var games = {}; //map addressable games; key is game id

app.use(session);

app.use(express.static('public'));

app.get('/', function(req, res) {
  checkSessionId(req);
  res.sendfile('public/lobby.html');
});

app.get('/creategame', function(req, res) {
  if (checkSessionId(req)) {
    if (req.query.go) {
      var newgameid = createNewGame(req.query);
      res.send("<div id='actionarea'>Created game: <a href='/game" + newgameid + "'>" + newgameid + "</a></div>");
    } else {
      res.sendfile('public/creategame.html');
    }
  } else {
    //redirect to lobby if session is invalid
    res.redirect('/');
  }
});

/*
app.get('/paulwins', function(req, res) {
  checkSessionId(req);
  game = null;
  res.sendfile('public/lobby.html');
});
*/

app.get('/game', function(req, res) { //TODO: make a template (Jade?) so that this dynamic list is part of the lobby page
  if (checkSessionId(req)) {
    //list current games
    var response = "Games:<br/><br/>";
    for (var gameid in games) {
      if (games.hasOwnProperty(gameid)) {
        response += "<a href='/game" + gameid + "'>" + gameid + "</a><br/>";
      }
    }
    response += "<br/><a href='/'>Back to lobby</a>";
    res.send(response);
  } else {
    //redirect to lobby if session is invalid
    res.redirect('/');
  }
});

app.get('/game:gameid', function(req, res) {
  if (checkSessionId(req)) {
    var game = checkGameId(req);
    if (game) {
      res.sendfile('public/game.html');
    } else {
      //not a valid game
      res.status(404).send("No such game<br><a href='/'>Back to lobby</a>");
    }
  } else {
    //redirect to lobby if session is invalid
    res.redirect('/');
  }
});

io.use(function(socket, next) {
  session(socket.handshake, {}, next);
});

io.on('connection', function(socket) {
  console.log('io connection started using session id ' + socket.handshake.session.uid);  
  
  socket.on('disconnect', function() {
    var uid = this.handshake.session.uid;
    console.log('io disconnect with session id ' + uid);
    //TODO: should remove from client list
  });
  
  if (clients[socket.handshake.session.uid]) { //check the client is still in memory


    //---------- lobby methods ----------
  
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
      console.log('lobby message from client ' + uid + ' (' + clients[uid].name + ') : ' +
        msg);
      io.emit('lobby', clients[uid].name + ': ' + msg);
      //} else {
      //  console.log('client ' + uid + ' swore');
      //  socket.emit('lobby', 'message rejected you rudey');
      //}
    });

    
    //---------- game methods ----------
    
    socket.on('requestGame', function() {
      var gameid = this.handshake.session.gameid;
      var game = games[gameid];
      if (game) {
        //must join the game channel
        socket.join(gameid);
        
        var uid = this.handshake.session.uid;
        //console.log("sending game state to client with id " + uid);
        var data = game.getObjectForClient();
        data.playerIndex = game.getPlayerIndex(uid);
        socket.emit('gameState', data);
      }
    });

    socket.on('game', function(msg) {
      var gameid = this.handshake.session.gameid;
      var game = games[gameid];
      if (game) {
        var uid = this.handshake.session.uid;
        console.log('game message from client ' + uid + ' (' + clients[uid].name + '): ' + msg);
        var colIndex = game.getPlayerIndex(uid);
        io.to(gameid).emit('game', { colour: colIndex && colIndex>-1 ? game.players[colIndex].colour : '#666666', msg: clients[uid].name + ': ' + msg });
      }
    });

    socket.on('ready', function() {
      var gameid = this.handshake.session.gameid;
      var game = games[gameid];
      if (game) {
        var uid = this.handshake.session.uid;
        //console.log('client with id ' + uid + ' has pressed ready');
        if (game.addPlayer(uid, clients[uid].name)) {
          io.to(gameid).emit('game', { colour: '#000000', msg: clients[uid].name + " is ready to play" });
          //io.emit('gameUpdate', { players: game.players }); //TODO: see below
          var data = game.getObjectForClient();
          socket.broadcast.to(gameid).emit('gameState', data);
          //socket.broadcast.emit('gameState', data);
          data.playerIndex = game.getPlayerIndex(uid);
          socket.emit('gameState', data);
        } else {
          socket.emit('alert', "you can't say you're ready for the game now");
        }
      }
    });

    socket.on('startGame', function() {
      var gameid = this.handshake.session.gameid;
      var game = games[gameid];
      if (game) {
        var uid = this.handshake.session.uid;
        //console.log('client with id ' + uid + ' has pressed start game');
        if (game.getPlayerIndex(uid) > -1) {
          if (game.prepareGame(function(alertMsg) {
              socket.emit('alert', alertMsg);
            })) {
            io.to(gameid).emit('game', { colour: '#000000', msg: clients[uid].name + " starts the game; it's " + game.players[game.currentPlayer].name + "'s turn" } );
            //TODO: find a neater way to update small changes instead of sending everything
            /*
            var data = { state: game.state,
                                    deck: game.deck.getObjectForClient(), 
                                    players: game.players
            }; //TODO: what else????
            console.log(data);
            io.emit('gameUpdate', data); 
            */
            data = game.getObjectForClient();
            io.to(gameid).emit('gameState', data);
            //io.emit('gameState', data);
          }
        } else {
          socket.emit('alert', "you aren't a player so you can't start the game");
        }
      }
    });

    socket.on('mouseDown', function(data) {
      var gameid = this.handshake.session.gameid;
      var game = games[gameid];
      if (checkTurn(socket, game)) {
        if (game.onclick(data.x, data.y, function(alertMsg) {
            socket.emit('alert', alertMsg);
          })) {
          data = game.getObjectForClient();
          io.to(gameid).emit('gameState', data);
        }
      }
    });

    socket.on('endTurn', function() {
      var gameid = this.handshake.session.gameid;
      var game = games[gameid];
      if (checkTurn(socket, game)) {
        if (game.endTurn(function(alertMsg) {
            socket.emit('alert', alertMsg);
          })) {

          if (game.state != 'finished') {
            game.nextTurn();
            io.to(gameid).emit('game', { colour: '#000000', msg: "turn ended; it's " + game.players[game.currentPlayer].name + "'s turn" });

          } else {
            io.to(gameid).emit('game', { colour: '#000000',  msg: game.determineWinner() });
          }
          data = game.getObjectForClient();
          io.to(gameid).emit('gameState', data);
        }
      }
    });

    socket.on('clearRoute', function() {
      var gameid = this.handshake.session.gameid;
      var game = games[gameid];
      if (checkTurn(socket, game)) {
        if (game.clearRoute(function(alertMsg) {
            socket.emit('alert', alertMsg);
          })) {
          data = game.getObjectForClient();
          io.to(gameid).emit('gameState', data);
        }
      }
    });
    
    socket.on('clearHand', function() {
      var gameid = this.handshake.session.gameid;
      var game = games[gameid];
      if (checkTurn(socket, game)) {
        if (game.clearHand(function(alertMsg) {
            socket.emit('alert', alertMsg);
          })) {
          data = game.getObjectForClient();
          io.to(gameid).emit('gameState', data);
        }
      }
    });

    socket.on('completeExtraction', function() {
      var gameid = this.handshake.session.gameid;
      var game = games[gameid];
      if (checkTurn(socket, game)) {
        if (game.completeExtraction(function(alertMsg) {
            socket.emit('alert', alertMsg);
          })) {
          data = game.getObjectForClient();
          io.to(gameid).emit('gameState', data);
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
    console.log('request using active session ' + req.session.uid + " (" + clients[req.session.uid]
      .name + ")");
    return true;
  } else {
    var uid = Date.now();
    req.session.uid = uid;
    var newplayer = {
      name: "annnnnonnn"
    };
    clients[uid] = newplayer;
    console.log('new session! assigned id ' + uid);
    return false;
  }
}

function checkGameId(req) {
  var id = req.params.gameid;
  console.log("game requested with id " + id);
  var game = games[id];
  req.session.gameid = id; //write game id into session
  return game; //returns undefined if doesn't exist
}

function checkTurn(socket, game) {
  if (game) {
    if (game.getPlayerIndex(socket.handshake.session.uid) == game.currentPlayer) {
      return true;
    } else {
      socket.emit('alert', "it's not your turn");
    }
  }
  return false;
}

function createNewGame(params) {
  var newgameid = Date.now();
  var game = Object.create(Game);
  var rules = Object.create(Rules);
  if (params.w) {
    rules.boardWidth = parseInt(params.w);
    console.log("set boardWidth");
  }
  if (params.h) {
    rules.boardHeight = parseInt(params.h);
    console.log("set boardHeight");
  }
  if (params.c) {
    rules.hexColours = parseInt(params.c);
    console.log("set hexColours");
  }
  if (params.bpp) {
    rules.briefcasesPerPlayer = parseInt(params.bpp);
    console.log("set briefcasesPerPlayer");
  }
  if (params.cph) {
    rules.cardsPerHex = parseInt(params.cph);
    console.log("set cardsPerHex");
  }
  if (params.sr) {
    rules.pointsPerHex = parseInt(params.sr);
    console.log("set pointsPerHex");
  }    
  if (params.sbs) {
    rules.minPointsPerBriefcase = parseInt(params.sbs);
    console.log("set minPointsPerBriefcase");
  }
  if (params.sbl) {
    rules.maxPointsPerBriefcase = parseInt(params.sbl);
    console.log("set maxPointsPerBriefcase");
  }   
  if (params.sba) {
    rules.briefcaseBonusAccumulator = parseInt(params.sba);
    console.log("set briefcaseBonusAccumulator");
  } 
  if (params.sbp) {
    rules.firstBriefcasePenalty = parseInt(params.sbp);
    console.log("set firstBriefcasePenalty");
  } 
 
  game.rules = rules;
  game.setup();
  games[newgameid] = game;
  return newgameid;
}
