$(document).ready(function() {

  var canvas = $("#canvas")[0];
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
    name: "briefcase",
    file: "briefcase.png"
  }, {
    name: "extractionpoint",
    file: "exit.png"
  }, {
    name: 'logo',
    file: "logo.png"
  }];

  imagesToLoad = imgList.length;
  for (var i = 0; i < imgList.length; i++) {
    loadImage(imgList[i]);
  }

  var button = $("#butDraw")[0];
  button.onclick = drawCardFromDeckButton;
  button = $("#butDrawPool")[0];
  button.onclick = drawCardsFromPoolButton;
  button = $("#butEndTurn")[0];
  button.onclick = endTurn;
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
  setup();
  draw();
}

var ctx, w, h;
var imagesToLoad;
var game;

function setup() {
  game = Object.create(Game);
  game.setup(10, 10);
  game.addPlayer("Player 1");
  game.addPlayer("Player 2");
  game.prepareGame();
}

function draw() {
  //reset canvas
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "black";
  ctx.strokeRect(0, 0, w, h);

  //draw objects
  game.draw(ctx);
}

function drawCardFromDeckButton() {
  game.players[game.currentPlayer].drawCardFromDeck();
  draw();
}

function drawCardsFromPoolButton() {
  game.players[game.currentPlayer].drawCardsFromPool();
  draw();
}

function endTurn() {
  if (game.players[game.currentPlayer].canEndTurn()) {
	game.nextTurn();
	draw();
  }
}
