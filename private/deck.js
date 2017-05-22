var Board = require('./board.js');
var Card = require('./card.js');

var Deck = {
  maxCardsInPool: 3,
  cardArray: [],
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
  },

  takeOneFromPool: function(target, index) {
    //Array.prototype.push.apply(target, this.cardPool.splice(index, 1));
    var poolCard = this.cardPool[index];
    if (poolCard) {
      poolCard.newlyDrawn = true;
      target.push(poolCard);
      this.cardPool[index] = null;
      return true;
    } else {
      return false;
    }
  },

  /*
  takePool: function(target) {
    var poolCard = this.cardPool.shift();
    if (poolCard) {
      target.push(poolCard);
      poolCard = this.cardPool.shift();
      if (poolCard) {
        target.push(poolCard);
        this.deal(this.cardPool, 2);
      }
    }
  },
  */

  buildDeck: function(hexArray, cardsPerHex) {
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
    Deck.drawPoints = Board.getRoundedPoints(points, Deck.cardRoundingRadius);

    for (var j = 0; j < hexArray.length; j++) {
      for (var i = 0; i < hexArray[j].length; i++) {
        for (var n = 0; n < cardsPerHex; n++) {
          if (hexArray[j][i].colourCode !== 0) {
            var card = Object.create(Card);
            card.hex = hexArray[j][i];
            card.isExtraction = (n == 0); //simple first attempt at extraction cards: first per hex is an extraction card
            card.isOutpost = (n == 1);
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

  determineClick: function(x, y) {
    return Math.floor(x / (Deck.cardWidth + Deck.cardSpacing));
  },

  getObjectForClient: function() {
    return {
      maxCardsInPool: Deck.maxCardsInPool,
      cardWidth: Deck.cardWidth,
      cardHeight: Deck.cardHeight,
      cardSpacing: Deck.cardSpacing,
      cardPool: Deck.getCardsForClient.call(this.cardPool, true),
      cardArray: Deck.getCardsForClient.call(this.cardArray),
      drawPoints: Deck.drawPoints
    };
  },
  getCardsForClient: function(faceup) {
    out = [];
    for (var i = 0; i < this.length; i++) {
      if (this[i]) {
        out.push({
          wobble: {
            x: this[i].wobble.x,
            y: this[i].wobble.y
          },
          focusOffsetX: this.focusOffsetX ? this.focusOffsetX : this[i].focusOffsetX,
          focusOffsetY: this.focusOffsetY ? this.focusOffsetY : this[i].focusOffsetY,
          rotation: this[i].rotation,
          newlyDrawn: this[i].newlyDrawn ? true : false,
          hex: faceup ? this[i].hex.getObjectForClient() : null,
          isExtraction: this[i].isExtraction,
          isOutpost: this[i].isOutpost
        });
      } else {
        out.push(this[i]);
      }
    }
    return out;
  }
};
module.exports = Deck;
