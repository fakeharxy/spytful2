var Deck = {

  draw: function (ctx, x, y) {
    //draw card pool
    // if (this.cardPool.length > 0) {
    //   Card.draw.call(this.cardPool[0], ctx, x + this.cardPool[0].focusOffsetX, y + this.cardPool[0].focusOffsetY, true);
    //   if (this.cardPool.length > 1) {
    //     Card.draw.call(this.cardPool[1], ctx, x + this.cardWidth + this.cardSpacing + this.cardPool[1].focusOffsetX, y + this.cardPool[1].focusOffsetY, true);
    //   }
    // }

    for (var i = 0 ; i < this.cardPool.length ; i++) {
      if (this.cardPool[i]) {
        Card.draw.call(this.cardPool[i], ctx, x + (this.cardWidth + this.cardSpacing) * i + this.cardPool[i].focusOffsetX, y + this.cardPool[i].focusOffsetY);
      }
    }

    //draw deck
    var xHeap = x + this.maxCardsInPool * (this.cardWidth + this.cardSpacing);
    for (var i = this.cardArray.length - 1; i >= 0; i--) {
      Card.draw.call(this.cardArray[i], ctx, xHeap, y);
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
};
