function Board(width, height) {
  this.width = width;
  this.height = height;
  this.hexSize = 30;
  this.firstHexX = 50;
  this.firstHexY = 50;
  this.offset = 5;
}

  Board.prototype.drawBoard = function (ctx) {
    for (var j = 0; j < this.height; j++) {
      for (var i = 0; i < this.width; i++) {
        var centre = {};
        centre.x = this.calculateHexCentreX(i, j);
        centre.y = this.calculateHexCentreY(j);
        drawHex(centre, this.hexSize, ctx);
      }
    }

  };

  Board.prototype.calculateHexCentreY = function (j) {
    return this.firstHexY + j * (this.hexSize + this.offset) * 1.5;
  };

  Board.prototype.calculateHexCentreX = function(i, j) {
    var x = this.firstHexX + i * (this.hexSize + this.offset) * Math.sqrt(3);
    if (j % 2 !== 0) {
      x += this.hexSize;
    }
    return x;
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
    ctx.fill();
  }

  function hex_corner(centre, hexSize, i) {
    var point = {};
    var angle_deg = 60 * i + 30;
    var angle_rad = Math.PI / 180 * angle_deg;
    point.x = centre.x + hexSize * Math.cos(angle_rad);
    point.y = centre.y + hexSize * Math.sin(angle_rad);
    return point;
  }
