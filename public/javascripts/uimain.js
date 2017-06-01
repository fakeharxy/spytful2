var socket;
var ctx, w, h, canvasX, canvasY;
var imagesToLoad;
var game;
var playerIndex;
var flashTimer;
var suppressTimer = 0;

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
    name: "fancycastle",
    file: "fancycastle.png"
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
  button = $("#butEndGame")[0];
  button.onclick = endGame;
  button = $("#butClearRoute")[0];
  button.onclick = clearRoute;
  button = $("#butClearHand")[0];
  button.onclick = clearHand;
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
    $('#messages').append($('<li style="color:' + msg.colour + '">').text(msg.msg));
    $("#chatarea").scrollTop($("#chatarea")[0].scrollHeight);
  });
  socket.on('alert', function(msg) {
    $('#alertMessage').stop(true, true).html(msg).show().delay(4000).fadeOut(1500);
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

function clearHand() {
  if (confirm('Are you sure you want to clear your hand? \n This can not be undone.')) {
    socket.emit('clearHand', '');
  }
}

function finishRoute() {
  socket.emit('completeExtraction', '');
}

function endTurn() {
  socket.emit('endTurn', '');
}

function endGame() {
  if (confirm("This will be your last action. No going back. You won't be given another turn. Points may be taken from you, and you won't be able to do anything about it. Are you sure?")) {
    socket.emit('endGame', '');
  }
}

function onMouseMove(event) {
  //game.onmousemove(event.pageX - canvasX, event.pageY - canvasY);
  //TODO: send the calculated co-ords to the server instead?
  if (flashTimer) {
	suppressTimer = 30; // don't display flasher for 30 cycles
  }
}

function onMouseDown(event) {
  //send the calculated co-ords to the server
  socket.emit('mouseDown', {x: event.pageX - canvasX, y: event.pageY - canvasY});
}
