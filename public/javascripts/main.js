$(document).ready(function(){

  var canvas = $("#canvas")[0];
  ctx = canvas.getContext("2d");
  w = $("#canvas").width();
  h = $("#canvas").height();

  ctx.font = "8pt Arial";


	var img = new Image;
	img.onload = function() {
        setup();
        draw();
	};
	img.onerror = function() {
		console.log("image not loaded");
	};
	img.src = "images/water.gif";
	ctx.imageCache = [];
	ctx.imageCache[0] = img;

  var butAction = $("#butAction")[0];
  butAction.onclick = actionFunction;
});

var ctx, w, h;
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
