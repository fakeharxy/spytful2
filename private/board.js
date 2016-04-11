var Hex = require('./hex.js');

module.exports = {
  hexSize: 32,
  hexRoundingRadius: 4,
  hexDrawPoints: [],
  firstHexX: 50,
  firstHexY: 50,
  offset: 10,
  outpostOffset: 5,
  
  buildBoard: function(width, height) {
    this.width = width;
    this.height = height;
    this.hexArray = [];

    //build template hex drawPoints
    Hex.corners = [];
    Hex.outpostCorners = [];
    for (var c = 0; c < 6; c++) {
      Hex.corners[c] = [];
      var point = [];
      var point2 = {}, point3 = {};
      var angle_deg = 60 * c + 270;
      var angle_rad = Math.PI / 180 * angle_deg;
      point[0] = this.hexSize * Math.cos(angle_rad);
      point[1] = this.hexSize * Math.sin(angle_rad);
      Hex.corners[c] = point;
      angle_rad += 0.52359877559829887307710723054658;
      point2.dx = (this.outpostOffset) * Math.cos(angle_rad);
      point2.dy = (this.outpostOffset) * Math.sin(angle_rad);
      point3.dx = (this.offset*Math.sqrt(3)-this.outpostOffset) * Math.cos(angle_rad);
      point3.dy = (this.offset*Math.sqrt(3)-this.outpostOffset) * Math.sin(angle_rad);
      Hex.outpostCorners[c] = [ point2, point3 ];
    }
    this.hexDrawPoints = this.getRoundedPoints(Hex.corners, this.hexRoundingRadius);
    
    //build hex objects
    for (var j = 0; j < this.height; j++) {
      this.hexArray[j] = [];
      for (var i = 0; i < this.width; i++) {
        var newHex = Object.create(Hex);
        newHex.regionName = String.fromCharCode(65 + j) + (i + 1);
        newHex.centre = {
          x: this.calculateHexCentreX(i, j),
          y: this.calculateHexCentreY(j)
        };
        this.hexArray[j][i] = newHex;
      }
    }
    this.prepareHexes();
  },

  prepareHexes: function() {
    for (var j = 0; j < this.height; j++) {
      for (var i = 0; i < this.width; i++) {
        var hex = this.hexArray[j][i];
        hex.neighbours = this.getHexNeighbours(i, j);
        hex.tokensOnHex = [];
        hex.setValidColour(this.hexSize);
        hex.outposts = ['','','','','',''];
      }
    }
  },

  getHexAt: function(x, y) {
    if (this.isValidCoordinate(x, y)) {
      return this.hexArray[y][x];
    }
  },

  calculateHexCentreY: function(j) {
    return this.firstHexY + j * (this.hexSize + this.offset) * 1.5;
  },

  calculateHexCentreX: function(i, j) {
    return this.firstHexX + (i+ (j&1 ? 0.5 : 0)) * (this.hexSize + this.offset) * Math.sqrt(3);
  },

  getRoundedPoints: function(pts, radius) {
    var i1, i2, i3, p1, p2, p3, prevPt, nextPt,
      len = pts.length,
      res = new Array(len);
    for (i2 = 0; i2 < len; i2++) {
      i1 = i2 - 1;
      i3 = i2 + 1;
      if (i1 < 0) {
        i1 = len - 1;
      }
      if (i3 == len) {
        i3 = 0;
      }
      p1 = pts[i1];
      p2 = pts[i2];
      p3 = pts[i3];
      prevPt = this.getRoundedPoint(p1[0], p1[1], p2[0], p2[1], radius, false);
      nextPt = this.getRoundedPoint(p2[0], p2[1], p3[0], p3[1], radius, true);
      res[i2] = [prevPt[0], prevPt[1], p2[0], p2[1], nextPt[0], nextPt[1]];
    }
    return res;
  },

  getRoundedPoint: function(x1, y1, x2, y2, radius, first) {
    var total = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
      idx = first ? radius / total : (total - radius) / total;
    return [x1 + (idx * (x2 - x1)), y1 + (idx * (y2 - y1))];
  },

  isValidCoordinate: function(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  },

  getHexNeighbours: function(x, y) {
    var odd = y & 1;
    var neighbours = [
      [x + (odd ? 1 : 0), y - 1],
      [x + 1, y],
      [x + (odd ? 1 : 0), y + 1],
      [x - (odd ? 0 : 1), y + 1],
      [x - 1, y],
      [x - (odd ? 0 : 1), y - 1]
    ];
    var result = [];
    for (var n = 0; n < 6; n++) {
      var hex = this.getHexAt(neighbours[n][0], neighbours[n][1]);
      result.push(hex);
    }
    return result;
  },

  determineClick: function(x, y) {
    var coords = this.pixel_to_hex(x - this.firstHexX, y - this.firstHexY);
    return this.getHexAt(coords.x, coords.y);
  },

  pixel_to_hex: function(x, y) {
    var q = (x * Math.sqrt(3) / 3 - y / 3) / (this.hexSize + this.offset);
    var r = y * 2 / 3 / (this.hexSize + this.offset);
    return this.cube_to_hex(this.cube_round({
      x: q,
      y: -q - r,
      z: r
    }));
  },

  cube_round: function(h) {
    var rx = Math.round(h.x);
    var ry = Math.round(h.y);
    var rz = Math.round(h.z);

    var x_diff = Math.abs(rx - h.x);
    var y_diff = Math.abs(ry - h.y);
    var z_diff = Math.abs(rz - h.z);

    if (x_diff > y_diff && x_diff > z_diff) {
      rx = -ry - rz;
    } else if (y_diff > z_diff) {
      ry = -rx - rz;
    } else {
      rz = -rx - ry;
    }
    return {
      x: rx,
      y: ry,
      z: rz
    };
  },

  cube_to_hex: function(h) {
    var col = h.x + (h.z - (h.z & 1)) / 2;
    var row = h.z;
    return {
      x: col,
      y: row
    };
  },
  
  
  getObjectForClient: function() {
    return { //width: this.width,
              //height: this.height,
              offset: this.offset,
              hexSize: this.hexSize,
              hexArray: this.getHexArrayForClient(),
              hexDrawPoints: this.hexDrawPoints,
              hexColourMap: Hex.colourMap,
              hexCorners: Hex.corners,
              hexOutpostCorners: Hex.outpostCorners,
              
           };
  },
  
  getHexArrayForClient: function() {
    var out = [];
    for (var j = 0; j < this.height; j++) {
      for (var i = 0; i < this.width; i++) {
        out.push(this.hexArray[j][i].getObjectForClient()); //hexes pushed as flat array to clients
      }
    }
    return out;
  }
};
