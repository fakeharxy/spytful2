function Board() {
  this.centre = {};
  this.centre.x = 50;
  this.centre.y = 50;
  this.hexSize = 30;

}

  Board.prototype.drawBoard = function (ctx) {
    drawHex(this.centre, this.hexSize, ctx);
  };

  function drawHex(centre, hexSize, ctx) {
    var firstPoint = hex_corner(centre, hexSize, 0);
    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (var i = 1; i <= 5; i++) {
      var nextPoint = hex_corner(centre, hexSize, i);
      ctx.lineTo(nextPoint.x, nextPoint.y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  function hex_corner(centre, hexSize, i) {
    var point = {};
    var angle_deg = 60 * i   + 30;
    var angle_rad = Math.PI / 180 * angle_deg;
    point.x = centre.x + hexSize * Math.cos(angle_rad);
    point.y = centre.y + hexSize * Math.sin(angle_rad);
    return point;
  }
