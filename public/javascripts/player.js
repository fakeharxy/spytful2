var Player = {
    setupHand: function() {
        this.hand = [];
    },

    drawHand: function (ctx, x, y) {
      //label
      ctx.font = '8pt Arial';
      ctx.textBaseline = "top";
      ctx.fillStyle = "#000"
      ctx.fillText(this.name + "'s hand:", x, y);

      //cards
      y+=Deck.cardSpacing;
      for (var i=0; i<this.hand.length; i++) {
        this.hand[i].draw(ctx, x + i * (Deck.cardWidth * 0.75), y + (i&1 ? 3 : 0), 0, true);
      }
    }

};
