var Board = {
  hexSize: 30,
  firstHexX: 50,
  firstHexY: 50,
  offset: 5,
  //width: 0,
  //height: 0,
  buildBoard: function (width, height) {
    this.width = width;
    this.height = height;
    this.hexArray = [];
    for (var j = 0; j < this.height; j++) {
      this.hexArray[j] = [];
      for (var i = 0; i < this.width; i++) {
        // var centre = {};
        // centre.x = this.calculateHexCentreX(i, j);
        // centre.y = this.calculateHexCentreY(j);
        this.hexArray[j][i] = Object.create(Hex);
      }
    }
  },

  drawBoard: function (ctx) {
    for (var j = 0; j < this.height; j++) {
      for (var i = 0; i < this.width; i++) {
        var centre = {};
        centre.x = this.calculateHexCentreX(i, j);
        centre.y = this.calculateHexCentreY(j);
        this.drawHex(centre, this.hexSize, ctx);
      }
    }
  },

  getHex: function(x, y) {
    return this.hexArray[y][x];
  },

  calculateHexCentreY: function (j) {
    return this.firstHexY + j * (this.hexSize + this.offset) * 1.5;
  },

  calculateHexCentreX: function (i, j) {
    var x = this.firstHexX + i * (this.hexSize + this.offset) * Math.sqrt(3);
    if (j % 2 !== 0) {
      x += this.hexSize;
    }
    return x;
  },

  drawHex: function (centre, hexSize, ctx) {
    var firstPoint = this.hex_corner(centre, hexSize, 0);
    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (var i = 1; i <= 5; i++) {
      var nextPoint = this.hex_corner(centre, hexSize, i);
      ctx.lineTo(nextPoint.x, nextPoint.y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  },

  hex_corner: function(centre, hexSize, i) {
    var point = {};
    var angle_deg = 60 * i + 30;
    var angle_rad = Math.PI / 180 * angle_deg;
    point.x = centre.x + hexSize * Math.cos(angle_rad);
    point.y = centre.y + hexSize * Math.sin(angle_rad);
    return point;
  }
}
