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

  playCardToStack: function(index) {
    var card = this.hand.splice(index, 1);
    this.stack.push(card[0]);
  },

  drawCardFromDeck: function() {
    game.deck.deal(this.hand, 1);
  },

  drawCardsFromPool: function() {
    game.deck.takePool(this.hand); 
  },
  
  canEndTurn: function() {
	if (this.hand.length <= Player.maxHandSize) {
		return true;
	} else {
		alert("cannot end turn; too many cards in hand");
		return false;
	}
  }
};
