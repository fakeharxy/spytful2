var Deck = require('./deck.js');

module.exports = {
  playerColours: {
    1: '#E80000',
    2: '#0000FF',
    3: '#CCFF33',
    4: '#006600',
    5: '#663300'
  },

  maxHandSize: 5,
  maxOutposts: 5,
  
  setup: function() {
    this.hand = [];
    this.stack = [];
    this.colour = this.playerColours[this.number];
    this.score = 0;
    this.briefcaseCount = 0;
    this.outposts = 0;
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

  playCardToStack: function(index, alert) {
    var validCardCheck = this.hand[index];
    if (this.validHandClick(validCardCheck, alert)) {
      var card = this.hand.splice(index, 1);
      this.stack.push(card[0]);
      if (this.stack.length == 1) {
        this.dropInToken(this.stack[0].hex);
      }
    }
  },

  validHandClick: function(card, alert) {
    if (card) {
      if (this.stack.length !== 0) {
        return true;
      } else if (!card.hex.hasBriefcase) { //first card played to stack cannot be briefcase
        return true;
      } else {
        alert("The rules dictate that this is not a valid card to play");
      }
    }
    return false;
  },

  drawCardFromDeck: function(game) {
    game.deck.deal(this.hand, 1);
  },

  drawCardsFromPool: function(game) {
    game.deck.takePool(this.hand);
  },
  
  getObjectForClient: function() {
    return { name: this.name,
             colour: this.colour,
             score: this.score,
             briefcaseCount: this.briefcaseCount,
             outposts: this.outposts,
             hand: Deck.getCardsForClient.call(this.hand),
             stack: Deck.getCardsForClient.call(this.stack)
    };
  }

};
