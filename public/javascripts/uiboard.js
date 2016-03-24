function drawBoard(ctx) {
  for (var j = 0; j < this.height; j++) {
    for (var i = 0; i < this.width; i++) {
      drawHex.call(this.hexArray[j][i], ctx, this.hexDrawPoints);
    }
  }
}