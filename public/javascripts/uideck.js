function drawDeck(ctx, x, y) {
  //draw card pool
  if (this.cardPool.length > 0) {
    drawCard.call(this.cardPool[0], ctx, x + this.cardPool.focusOffsetX, y + this.cardPool.focusOffsetY, true);
    if (this.cardPool.length > 1) {
      drawCard.call(this.cardPool[1], ctx, x + this.cardWidth + this.cardSpacing + this.cardPool.focusOffsetX, y + this.cardPool.focusOffsetY, true);
    }
  }

  //draw deck
  var xHeap = x + 2 * (this.cardWidth + this.cardSpacing);
  for (var i = this.cardArray.length - 1; i >= 0; i--) {
    drawCard.call(this.cardArray[i], ctx, xHeap, y, false);
  }
  //remaining cards label
  if(this.cardArray.length > 0) {
    ctx.font = '8pt Arial';
    ctx.textBaseline = "top";
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.fillText(this.cardArray.length, xHeap + this.cardWidth, y + this.cardHeight + this.cardSpacing/2);
  }
}