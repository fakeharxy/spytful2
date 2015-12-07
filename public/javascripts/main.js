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

  var button = $("#butEndTurn")[0];
  button.onclick = endTurn;
  button = $("#butClearRoute")[0];
  button.onclick = clearRoute;
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

var ctx, w, h, canvasX, canvasY;
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

function clearRoute() {
  if (confirm('Are you sure you want to clear your route? \n This can not be undone.')) {
    game.clearRoute();
    draw();
  }
}

function endTurn() {
  if (game.turnState == 'finished') {
    game.nextTurn();
    draw();
  } else {
    alert("The game rules dictate you must draw cards before ending your turn...");
  }
}

function onMouseMove(event) {
  game.onmousemove(event.pageX - canvasX, event.pageY - canvasY);
}
function onMouseDown(event) {
  game.onclick(event.pageX - canvasX, event.pageY - canvasY);
}
