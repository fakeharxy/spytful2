var Player = {
  playerColours: {
    1: '#E80000',
    2: '#0000FF',
    3: '#CCFF33',
    4: '#006600',
    5: '#663300'
  },
  maxHandSize: 5,
  setup: function() {
    this.hand = [];
    this.stack = [];
    this.colour = this.playerColours[this.number];
    this.score = 0;
    this.briefcaseCount = 0;
  },

  drawHand: function(ctx, x, y) {
    //label
    ctx.font = '8pt Arial';
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = "#000";
    ctx.fillText(this.name + "'s hand:", x, y);

    //cards
    y += Deck.cardSpacing;
    for (var i = 0; i < this.hand.length; i++) {
      this.hand[i].draw(ctx, x + i * (Deck.cardWidth * 0.75), y + (i & 1 ? 3 : 0), true);
    }
  },

  determineClick: function(x, y) {
    var index = Math.floor(x / (Deck.cardWidth * 0.75));
    if (index >= this.hand.length) {
      if (x < this.hand.length * Deck.cardWidth * 0.75 + Deck.cardWidth * 0.25) {
        index--;
      }
    }
    return index;
  },

  drawStack: function(ctx, x, y, faceup) {
    //label
    ctx.font = '8pt Arial';
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = "#000";
    ctx.fillText(this.name + "'s movement stack:", x, y);

    //cards
    y += Deck.cardSpacing;

    for (var i = 0; i < this.stack.length; i++) {
      this.stack[i].draw(ctx, x + i * (Deck.cardWidth * 0.75), y + (i & 1 ? 3 : 0), i === 0 ||
        faceup ? true : false);
    }
  },

  dropInToken: function(hex) {
    if (this.tokenHex !== undefined) {
      this.tokenHex.removeToken(this.colour);
    }
    this.tokenHex = hex;
    if (hex !== undefined) {
      this.tokenHex.addToken(this.colour);
    }
  },

  clearRoute: function() {
    this.stack = [];
    this.dropInToken(undefined);
  },

  playCardToStack: function(index) {
    var validCardCheck = this.hand[index];
    if (this.validHandClick(validCardCheck)) {
      var card = this.hand.splice(index, 1);
      this.stack.push(card[0]);
      if (this.stack.length == 1) {
        this.dropInToken(this.stack[0].hex);
      }
    }
  },

  validHandClick: function(card) {
    if (card !== []) {
      if (this.stack.length !== 0) {
        return true;
      } else if (!card.hex.hasBriefcase && !card.hex.isExtractionpoint) {
        return true;
      } else {
        alert("The rules dictate that this is not a valid card to play");
      }
    }
    return false;
  },

  drawCardFromDeck: function() {
    game.deck.deal(this.hand, 1);
  },

  drawCardsFromPool: function() {
    game.deck.takePool(this.hand);
  }

};
