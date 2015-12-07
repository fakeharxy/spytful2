var Player = {
  maxHandSize: 5,

  setupHand: function() {
    this.hand = [];
    this.stack = [];
  },

  drawHand: function(ctx, x, y) {
    //label
    ctx.font = '8pt Arial';
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = "#000"
    ctx.fillText(this.name + "'s hand:", x, y);

    //cards
    y += Deck.cardSpacing;
    for (var i = 0; i < this.hand.length; i++) {
      this.hand[i].draw(ctx, x + i * (Deck.cardWidth * 0.75), y + (i & 1 ? 3 : 0), true);
    }
  },

  determineClick: function(x, y) {
    var index = Math.floor(x / (Deck.cardWidth * 0.75))
    if (index >= this.hand.length) {
		if (x < this.hand.length * Deck.cardWidth * 0.75 + Deck.cardWidth * 0.25) {
			index--;
		}
	}
	return index;
  },

  drawStack: function(ctx, x, y) {
    //label
    ctx.font = '8pt Arial';
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = "#000"
    ctx.fillText(this.name + "'s movement stack:", x, y);

    //cards
    y += Deck.cardSpacing;

    for (var i = 0; i < this.stack.length; i++) {
      this.stack[i].draw(ctx, x + i * (Deck.cardWidth * 0.75), y + (i & 1 ? 3 : 0), i === 0 ?
        true : false);
    }
  },

  clearRoute: function() {
    this.stack = [];
  },

  playCardToStack: function(index) {
    var card = this.hand.splice(index, 1);
    this.stack.push(card[0]);
  },

  drawCardFromDeck: function() {
    game.deck.deal(this.hand, 1);
  },

  drawCardsFromPool: function() {
    game.deck.takePool(this.hand);
  }

};
