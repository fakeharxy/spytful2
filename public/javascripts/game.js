var Game = {
  briefcasesPerPlayer: 3,
  extractionpointsPerPlayer: 3,
  startCardsPool: 2,
  startCardsPlayer: 2,
  
  setup: function (boardWidth, boardHeight) {
    this.board = Object.create(Board);
    this.board.buildBoard(boardWidth, boardHeight);

    this.deck = Object.create(Deck);
    this.deck.buildDeck(this.board.hexArray);
    Deck.shuffle(this.deck.cardArray);

    this.players = [];
  },

  addPlayer: function (name) {
    var player = Object.create(Player);
    player.name = name;
    player.setupHand();
    this.players.push(player);
  },

  prepareGame: function () {
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
  },

  draw: function (ctx) {
    //draw hexes
    this.board.drawBoard(ctx);
    //draw deck, a little to the right of the hexes
    var deckX = 2 * (this.board.width * this.board.hexSize + this.board.firstHexX);
    var deckY = this.board.firstHexY - this.board.hexSize;
    this.deck.draw(ctx, deckX, deckY);

    //draw all players' hands
      this.players[0].drawHand(ctx, deckX, deckY + (this.deck.cardHeight + 2*this.deck.cardSpacing));
      this.players[0].drawStack(ctx, deckX, deckY + 2*(this.deck.cardHeight + 2*this.deck.cardSpacing));
  }
}
