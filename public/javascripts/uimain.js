var socket;
var ctx, w, h, canvasX, canvasY;
var imagesToLoad;
var game;
var playerIndex;

$(document).ready(function() {

  var canvas = $("#canvas")[0];
  var rect = canvas.getBoundingClientRect();
  canvasX = rect.left;
  canvasY = rect.top;
  canvas.addEventListener("mousedown", onMouseDown, false);
  canvas.addEventListener("mousemove", onMouseMove, false);
  ctx = canvas.getContext("2d");
  w = $("#canvas").width();
  h = $("#canvas").height();

  ctx.font = "8pt Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("loading...", w / 2, h / 2);

  ctx.imageCache = [];
  var imgList = [{
    name: "water",
    file: "water.gif"
  }, {
    name: "briefcase1",
    file: "briefcase1.png"
  }, {
    name: "briefcase2",
    file: "briefcase2.png"
  }, {
    name: "briefcase3",
    file: "briefcase3.png"
  }, {
    name: 'logo',
    file: "logo.png"
  }];

  imagesToLoad = imgList.length;
  for (var i = 0; i < imgList.length; i++) {
    loadImage(imgList[i]);
  }

  var button = $("#butEndTurn")[0];
  button.onclick = endTurn;
  button = $("#butClearRoute")[0];
  button.onclick = clearRoute;
  button = $("#butFinishRoute")[0];
  button.onclick = finishRoute;
  button = $("#butReady")[0];
  button.onclick = playerReady;
  button = $("#butStartGame")[0];
  button.onclick = startGame;
});

function loadImage(imgToLoad) {
  var img = new Image;
  img.onload = function() {
    console.log("loaded image " + imgToLoad.file);
    if (--imagesToLoad == 0) imagesReady();
  };
  img.onerror = function() {
    console.log("error loading image " + imgToLoad.file);
  };
  img.src = "images/" + imgToLoad.file;
  ctx.imageCache[imgToLoad.name] = img;
}

function imagesReady() {
  //only at this point can the client connect to the socket and request the 'game' object/data
  startSocket();
}

function startSocket() {
  socket = io();
  socket.emit("game", "joined the game");
  $('#message_form').submit(function() {
    var m = $('#m');
    if (m.val()) {
      socket.emit('game', m.val());
      m.val('');
    }
    return false;
  });
  socket.on('game', function(msg) {
    $('#messages').append($('<li>').text(msg));
    $("#chatarea").scrollTop($("#chatarea")[0].scrollHeight);
  });
  socket.on('gameState', function(gameData) {
    game = gameData;
    if (game.playerIndex) {
      playerIndex = game.playerIndex;
      console.log('setting playerIndex: ' + playerIndex);
    }
    showControls();
    draw();
  });
  socket.on('gameUpdate', function(mergeData) {
    console.log(mergeData);
    for (var attr in mergeData) { game[attr] = mergeData[attr]; }
    draw();
  });
  socket.emit("requestGame", "");
}

function showControls() {
  if (game.state == "setupPlayers") {
    $('#prepareControls').show();
    $('#turnControls').hide();
  } else {
    $('#prepareControls').hide();
    if (playerIndex == game.currentPlayer) {
      $('#turnControls').show();
    } else {
      $('#turnControls').hide();
    }
  }
}

function draw() {
  //reset canvas
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "black";
  ctx.strokeRect(0, 0, w, h);

  //draw objects
  //drawGame.call(game, ctx);
  Game.draw.call(game, ctx);
}

function playerReady() {
  socket.emit("ready", "");
}

function startGame() {
  socket.emit("startGame", "");
}

function clearRoute() {
  if (confirm('Are you sure you want to clear your route? \n This can not be undone.')) {
    socket.emit('clearRoute', '');
  }
}

function finishRoute() {
  socket.emit('completeExtraction', '');
}

function endTurn() {
  socket.emit('endTurn', '');
}

function onMouseMove(event) {
  //game.onmousemove(event.pageX - canvasX, event.pageY - canvasY);
  //TODO: send the calculated co-ords to the server instead?
}

function onMouseDown(event) {
  //send the calculated co-ords to the server
  socket.emit('mouseDown', {x: event.pageX - canvasX, y: event.pageY - canvasY});
}
