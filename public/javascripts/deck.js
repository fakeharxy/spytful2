var Deck = {
  cardArray: [],
  deckSizeMultiple: 3,
  cardWidth: 60,
  cardHeight: 100,
  cardRoundingRadius: 10,
  cardSpacing: 20,
  cardRotationMax: 0.08,
  cardWobbleMax: 8,
  drawPoints: [],

  deal: function(dealTarget, dealNumber) {
    Array.prototype.push.apply(dealTarget, this.cardArray.splice(
      0, dealNumber));
    if (this.cardArray.length === 0) {
      alert('This game is over. The winner is Player 1');
    }
  },

  takePool: function(target) {
    // target = target.concat(this.cardPool);
    target.push(this.cardPool.shift());
    target.push(this.cardPool.shift());
    // this.cardPool = [];
    // this.cardPool.focusOffsetX = 0;
    // this.cardPool.focusOffsetY = 0;
    this.deal(this.cardPool, 2);
  },

  buildDeck: function(hexArray) {
    this.cardPool = [];
    this.cardPool.focusOffsetX = 0;
    this.cardPool.focusOffsetY = 0;
    this.cardArray = [];
    var points = [
      [0, 0],
      [Deck.cardWidth, 0],
      [Deck.cardWidth, Deck.cardHeight],
      [0, Deck.cardHeight]
    ];
    drawPoints = Board.getRoundedPoints(points, Deck.cardRoundingRadius);

    for (var j = 0; j < hexArray.length; j++) {
      for (var i = 0; i < hexArray[j].length; i++) {
        for (var n = 0; n < this.deckSizeMultiple; n++) {
          if (hexArray[j][i].colourCode !== 0) {
            var card = Object.create(Card);
            card.hex = hexArray[j][i];
            card.rotation = Math.random() * Deck.cardRotationMax -
              Deck.cardRotationMax / 2;
            var wobble = {};
            wobble.x = Math.random() * Deck.cardWobbleMax -
              Deck.cardWobbleMax / 2;
            wobble.y = Math.random() * Deck.cardWobbleMax -
              Deck.cardWobbleMax / 2;
            card.wobble = wobble;
            this.cardArray.push(card);
          }
        }
      }
    }
  },

  shuffle: function(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() *
        i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  },

  draw: function(ctx, x, y) {
    //draw card pool
    if (this.cardPool.length > 0) {
      this.cardPool[0].draw(ctx, x + this.cardPool.focusOffsetX, y + this.cardPool.focusOffsetY,
        true);
      if (this.cardPool.length > 1) {
        this.cardPool[1].draw(ctx, x + Deck.cardWidth +
          Deck.cardSpacing + this.cardPool.focusOffsetX,
          y + this.cardPool.focusOffsetY, true);
      }
    }

    //draw deck
    var xHeap = x + 2 * (Deck.cardWidth + Deck.cardSpacing);
    for (var i = this.cardArray.length - 1; i >= 0; i--) {
      this.cardArray[i].draw(ctx, xHeap, y, false);
    }
  },

  determineClick: function(x, y) {
    return Math.floor(x / (Deck.cardWidth + Deck.cardSpacing));
  }
};
