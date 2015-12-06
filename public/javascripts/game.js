var Game = {
  briefcasesPerPlayer: 3,
  extractionpointsPerPlayer: 3,
  startCardsPool: 2,
  startCardsPlayer: 2,
  state: "setupBoard",
  
  setup: function (boardWidth, boardHeight) {
	if (this.state!="setupBoard") {
		alert("error: board already set up");
		return;
	}
    this.board = Object.create(Board);
    this.board.buildBoard(boardWidth, boardHeight);

    this.deck = Object.create(Deck);
    this.deck.buildDeck(this.board.hexArray);
    Deck.shuffle(this.deck.cardArray);

    this.players = [];
	this.state = "setupPlayers";
  },

  addPlayer: function (name) {
	if (this.state!="setupPlayers") {
		alert("error: game not in player setup stage");
		return;
	}
    var player = Object.create(Player);
    player.name = name;
    player.setupHand();
    this.players.push(player);
  },

  prepareGame: function () {
	if (this.state!="setupPlayers") {
	  alert("error: game not in setup stage");
	  return;
	}
	if (this.players.length<2) {
	  alert("error: not enough players to start game");
	  return;
	}
	
    //add briefcases and extraction points
    var validHexes = [];
    for (var j = 0; j < this.board.height; j++) {
      for (var i = 0; i < this.board.width; i++) {
        if (this.board.hexArray[j][i].colourCode!=0) {
          validHexes.push(this.board.hexArray[j][i]);
        }
      }
    }
    var briefcaseCount = this.players.length * Game.briefcasesPerPlayer;
    var extractionpointCount = this.players.length * Game.extractionpointsPerPlayer;
    if (validHexes.length < briefcaseCount + extractionpointCount) {
      alert("too many players on too small a board; tests don't count");
      return;
    }
    Deck.shuffle(validHexes);
    for (var i=0; i<briefcaseCount; i++) {
      validHexes.shift().hasBriefcase = true;
    }
    for (var i=0; i<extractionpointCount; i++) {
      validHexes.shift().isExtractionpoint = true;
    }


    //deal cards into the card pool
    this.deck.deal(this.deck.cardPool, this.startCardsPool);

    //deal cards to each player
    for (var i=0; i<this.players.length; i++) {
      this.deck.deal(this.players[i].hand, this.startCardsPlayer);
    }
	
	//start first turn
	this.currentPlayer = 0;
	this.state="started";
  },
  
  nextTurn: function() {
	if (++this.currentPlayer >= this.players.length) {
	  this.currentPlayer = 0;
	}
  },

  draw: function (ctx) {
    //draw hexes
    this.board.drawBoard(ctx);
    //draw deck, a little to the right of the hexes
    var deckX = 2 * (this.board.width * this.board.hexSize + this.board.firstHexX);
    var deckY = this.board.firstHexY - this.board.hexSize;
    this.deck.draw(ctx, deckX, deckY);

    //draw current player's hand
    this.players[this.currentPlayer].drawHand(ctx, deckX, deckY + (this.deck.cardHeight + 2*this.deck.cardSpacing));
    this.players[this.currentPlayer].drawStack(ctx, deckX, deckY + 2*(this.deck.cardHeight + 2*this.deck.cardSpacing));
  }
}
