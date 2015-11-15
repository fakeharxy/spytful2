$(document).ready(function(){

    var canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);

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
	
	
});

var board;
var deck;
var ctx;

function setup() {
    board = Object.create(Board);
    board.buildBoard(10,10);
    deck = Object.create(Deck);
    deck.buildDeck(board.hexArray);
    deck.shuffle(deck.cardArray);
    deck.deal(deck.cardPool, 2);
};

function draw() {
	deck.draw(ctx, 700, 50);
    board.drawBoard(ctx);
};
