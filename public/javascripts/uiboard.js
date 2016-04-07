function drawBoard(ctx) {
  for (var i = 0; i < this.hexArray.length; i++) {
    drawHex.call(this.hexArray[i], ctx, this.hexDrawPoints);
  }
}