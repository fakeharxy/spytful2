function drawHand(ctx, x, y) {
  //label
  ctx.font = '8pt Arial';
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillStyle = "#000";
  ctx.fillText(this.name + "'s hand:", x, y);

  //cards
  y += game.deck.cardSpacing;
  for (var i = 0; i < this.hand.length; i++) {
    drawCard.call(this.hand[i], ctx, x + i * (game.deck.cardWidth * 0.75), y + (i & 1 ? 3 : 0), true);
  }
};

function drawStack(ctx, x, y, faceup) {
  //label
  ctx.font = '8pt Arial';
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillStyle = "#000";
  ctx.fillText(this.name + "'s movement stack:", x, y);

  //cards
  y += game.deck.cardSpacing;

  for (var i = 0; i < this.stack.length; i++) {
    this.stack[i].draw(ctx, x + i * (game.deck.cardWidth * 0.75), y + (i & 1 ? 3 : 0), i === 0 ||
      faceup ? true : false);
  }
};