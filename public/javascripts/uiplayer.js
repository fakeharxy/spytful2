var Player = {
  drawHand: function (ctx, x, y, faceup, scale) {
    //label
    ctx.font = '8pt Arial';
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = "#000";
    ctx.fillText(this.name + "'s hand:", x, y);

    //cards
    y += game.deck.cardSpacing;
    for (var i = 0; i < this.hand.length; i++) {
      Card.draw.call(this.hand[i], ctx, x + i * (game.deck.cardWidth * 0.75) * (scale ? scale : 1), y + (i & 1 ? 3 : 0), faceup, scale);
    }
  },

  drawStack: function (ctx, x, y, faceup, scale) {
    //label
    ctx.font = '8pt Arial';
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = "#000";
    ctx.fillText(this.name + "'s movement stack:", x, y);

    //cards
    y += game.deck.cardSpacing;

    for (var i = 0; i < this.stack.length; i++) {
      Card.draw.call(this.stack[i], ctx, x + i * (game.deck.cardWidth * 0.75) * (scale ? scale : 1), y + (i & 1 ? 3 : 0), i === 0 || faceup ? true : false, scale);
    }
  }
};