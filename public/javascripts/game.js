var Game = {
  briefcasesPerPlayer: 3,
  extractionpointsPerPlayer: 3,
  startCardsPool: 2,
  startCardsPlayer: 2,
  state: "setupBoard",
  turnState: "pre-start",

  setup: function(boardWidth, boardHeight) {
    if (this.state != "setupBoard") {
      alert("error: board already set up");
      return;
    }
    this.board = Object.create(Board);
    this.board.buildBoard(boardWidth, boardHeight);

    this.deck = Object.create(Deck);
    this.deck.buildDeck(this.board.hexArray);
    Deck.shuffle(this.deck.cardArray);

    this.players = [];

    this.setupCoordinates();

    this.state = "setupPlayers";
  },

  setupCoordinates: function() {
    //deck is positioned a little to the right of the hexes
    this.deckX = 2 * (this.board.width * this.board.hexSize + this.board.firstHexX);
    this.deckY = this.board.firstHexY - this.board.hexSize;

    //current player's hand is positioned below the deck
    this.handX = this.deckX;
    this.handY = this.deckY + (this.deck.cardHeight + 2 * this.deck.cardSpacing);

    //current player's movement stack is positioned below the hand
    this.stackX = this.deckX;
    this.stackY = this.deckY + 2 * (this.deck.cardHeight + 2 * this.deck.cardSpacing)
  },

  addPlayer: function(name) {
    if (this.state != "setupPlayers") {
      alert("error: game not in player setup stage");
      return;
    }
    var player = Object.create(Player);
    player.name = name;
    player.setupHand();
    this.players.push(player);
  },

  prepareGame: function() {
    if (this.state != "setupPlayers") {
      alert("error: game not in setup stage");
      return;
    }
    if (this.players.length < 2) {
      alert("error: not enough players to start game");
      return;
    }

    //add briefcases and extraction points
    var validHexes = [];
    for (var j = 0; j < this.board.height; j++) {
      for (var i = 0; i < this.board.width; i++) {
        if (this.board.hexArray[j][i].colourCode != 0) {
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
    for (var i = 0; i < briefcaseCount; i++) {
      validHexes.shift().hasBriefcase = true;
    }
    for (var i = 0; i < extractionpointCount; i++) {
      validHexes.shift().isExtractionpoint = true;
    }


    //deal cards into the card pool
    this.deck.deal(this.deck.cardPool, this.startCardsPool);

    // deal cards to each player
    for (var i = 0; i < this.players.length; i++) {
      this.deck.deal(this.players[i].hand, this.startCardsPlayer);
    }

    //start first turn
    this.currentPlayer = 0;
    this.turnState = "playing";
    this.state = "started";
  },

  nextTurn: function() {
    if (++this.currentPlayer >= this.players.length) {
      this.currentPlayer = 0;
    }
    this.turnState = 'playing';
  },

  draw: function() {

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);

    //draw hexes
    this.board.drawBoard(ctx);

    //draw deck
    this.deck.draw(ctx, this.deckX, this.deckY);

    //draw current player's hand
    this.players[this.currentPlayer].drawHand(ctx, this.handX, this.handY);
    this.players[this.currentPlayer].drawStack(ctx, this.stackX, this.stackY);
  },

  onclick: function(x, y) {
    //locate click
    if (x < this.deckX) {
      console.log("clicked on board");
    } else if (y < this.handY) {
      if (this.turnState == "playing") {
        var poolDeckCardIndex = this.deck.determineClick(x - this.deckX, y - this.deckY);
        if (poolDeckCardIndex < this.deck.cardPool.length) {
          this.drawCardsFromPool();
        } else if (poolDeckCardIndex === this.deck.cardPool.length) {
          this.drawCardFromDeck();
        }
      } else {
        alert("The rules state that you can only draw cards once a turn");
      }
    } else if (y < this.stackY) {
      if (this.turnState == "playing") {
        var handCardIndex = this.players[this.currentPlayer].determineClick(x - this.handX, y -
          this.handY);
        if (handCardIndex < this.players[this.currentPlayer].hand.length) {
          this.players[this.currentPlayer].playCardToStack(handCardIndex);
          this.draw();
        }
      } else {
        alert("The rules state that once you have drawn cards, you can no longer play actions");
      }
    } else {
      console.log("clicked on stack");
    }
  },

  clearRoute: function() {
    game.players[game.currentPlayer].clearRoute();
  },

  drawCardFromDeck: function() {
    if (game.players[game.currentPlayer].hand.length < Player.maxHandSize) {
      game.players[game.currentPlayer].drawCardFromDeck();
      this.turnState = "finished";
      this.draw();
    } else {
      alert("There is no room in your hand. Play some cards first");
    }
  },

  drawCardsFromPool: function() {
    if (game.players[game.currentPlayer].hand.length < Player.maxHandSize - 1) {
      game.players[game.currentPlayer].drawCardsFromPool();
      this.turnState = "finished";
      this.draw();
    } else {
      alert("There is no room in your hand. Play some cards first");
    }
  }
}
