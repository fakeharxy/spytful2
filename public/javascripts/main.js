$(document).ready(function(){

  var canvas = $("#canvas")[0];
  ctx = canvas.getContext("2d");
  w = $("#canvas").width();
  h = $("#canvas").height();

  ctx.font = "8pt Arial";


  ctx.imageCache = [];
  var imgList = [ { name: "water", file: "water.gif" },
	  { name: "briefcase", file: "briefcase.png" }];
	  
  imagesToLoad = imgList.length;
  for (var i=0; i<imgList.length; i++) {
	  loadImage(imgList[i]);
  }
  
  var butAction = $("#butAction")[0];
  butAction.onclick = actionFunction;
});

function loadImage(imgToLoad) {
	var img = new Image;
	img.onload = function() {
        console.log("loaded image " + imgToLoad.file);
		if (--imagesToLoad==0) imagesReady();
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
var board;
var deck;
var players;

function setup() {
    board = Object.create(Board);
    board.buildBoard(10,10);
    deck = Object.create(Deck);
    deck.buildDeck(board.hexArray);
    deck.shuffle(deck.cardArray);
    deck.deal(deck.cardPool, 2);

	//add some briefcases for testing
	for (var i=0; i<12; i++) {
		board.hexArray[Math.floor(Math.random() * board.height)][Math.floor(Math.random() * board.width)].hasBriefcase = true;
	}
	
    //set up players
    players = [];
    var p1 = Object.create(Player);
    p1.name = "Player 1";
    p1.setupHand();
    deck.deal(p1.hand, 2);
    players.push(p1);
};

function draw() {
  //reset canvas
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "black";
  ctx.strokeRect(0, 0, w, h);

  //draw objects
  board.drawBoard(ctx);
  var deckX = 2 * (board.width * board.hexSize + board.firstHexX);
  var deckY = board.firstHexY - board.hexSize;
  deck.draw(ctx, deckX, deckY);
  if (players && players.length > 0) {
    players[0].drawHand(ctx, deckX, deckY + Deck.cardHeight + Deck.cardSpacing);
  }

};

function actionFunction() {
  //deals another card to player 1
  deck.deal(players[0].hand, 1);
  draw();
}
