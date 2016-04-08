var Board = {
  draw: function (ctx) {
    for (var i = 0; i < this.hexArray.length; i++) {
      Hex.draw.call(this.hexArray[i], ctx, this.hexDrawPoints);
    }
  }
};