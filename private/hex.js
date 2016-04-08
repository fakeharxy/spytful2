var Hex = {
  colourMap: ["#000099",
    "#78FF78",
    "#CBBC91",
    "#FFD1DC",
    "#FDFD7D",
    "#96CAFD",
    "#FFB347",
    "#BF94E4"
  ],

  addToken: function(colour) {
    if (this.tokensOnHex === undefined) {
      this.tokensOnHex = [];
    }
    this.tokensOnHex.push(colour);
  },

  removeToken: function(colour) {
    for (var i = 0; i < this.tokensOnHex.length; i++) {
      if (this.tokensOnHex[i] == colour) {
        this.tokensOnHex.splice(i, 1);
        break;
      }
    }
  },

  setValidColour: function() {
    //find invalid colours based on neighbours
    var invalid = [];
    for (var i = 0; i < this.neighbours.length; i++) {
      var hex = this.neighbours[i];
      if (hex) {
        if (hex.colourCode !== undefined) {
          invalid.push(hex.colourCode);
        }
      }
    }
    //build valid list
    var valid = [];
    for (var i = 0; i < Hex.colourMap.length; i++) {
      if (invalid.indexOf(i) == -1) {
        valid.push(i);
      }
    }
    if (valid.length > 0) {
      //pick randomly from remaining valid colour codes
      var index = Math.floor(Math.random() * valid.length);
      this.colourCode = valid[index];
    } else {
      console.log("error: no valid colours left for a hex");
    }
  },

  getNeighbourSegment: function(testHex) {
    for (var i = 0; i < this.neighbours.length; i++) {
      if (this.neighbours[i] === testHex) {
        return i;
      }
    }
    //if the testHex is not a neighbour, return -1
    return -1;
  },

  determineSegment: function(x, y) {
    var dx = x - this.centre.x;
    var dy = y - this.centre.y;
    var angle = Math.atan2(dy, dx) + Math.PI / 2;
    var segment = this.fixSegment(Math.floor(angle / (Math.PI / 3)));
    return segment;
  },

  fixSegment: function(segment) {
    return (6 + segment) % 6;
  },

  newOutpostValid: function(segment, colourCode) {
    // checks if a new outpost can be built on this segment
    // (by checking x2 neighbours of both relevant hexes)
    if (this.getOutpostAt(this.fixSegment(segment - 1)) == colourCode ||
      this.getOutpostAt(this.fixSegment(segment + 1)) == colourCode) {
      return false;
    }
    var oppHex = this.neighbours[segment];
    if (oppHex && (oppHex.getOutpostAt(this.fixSegment(segment + 2)) == colourCode ||
        oppHex.getOutpostAt(this.fixSegment(segment + 4)) == colourCode)) {
      return false;
    }
    return true;
  },

  getOutpostAt: function(segment) {
    // checks the colourCode of the outpost at this position
    // (by checking both relevant hexes)
    // - returns '' if no outpost is present
    // - returns 'invalid' if no outpost would be valid (hex is
    //   at edge of board or segment borders a water hex)
    if (this.outposts[segment] != '') {
      return this.outposts[segment];
    }
    if (this.colourCode == 0) {
      return 'invalid';
    }
    var oppHex = this.neighbours[segment];
    if (oppHex && oppHex.colourCode !== 0) {
      var oppSeg = this.fixSegment(segment + 3);
      if (oppHex.outposts[oppSeg] != '') {
        return oppHex.outposts[oppSeg];
      }
    } else {
      return 'invalid';
    }
    return "";
  },

  setOutpostAt: function(segment, colourCode) {
    this.outposts[segment] = colourCode;
    var oppHex = this.neighbours[segment];
    if (oppHex) {
      oppHex.outposts[this.fixSegment(segment + 3)] = "";
    }
  },

  removeOutpostAt: function(segment) {
    this.setOutpostAt(segment, "");
  },


  getObjectForClient: function() {
    return {
      centre: this.centre,
      colourCode: this.colourCode,
      waterOffset: this.waterOffset,
      waterRotate: this.waterRotate,
      regionName: this.regionName,
      hasBriefcase: this.hasBriefcase,
      briefcaseValue: this.briefcaseValue,
      tokensOnHex: this.tokensOnHex,
      outposts: this.outposts
    };
  }
};
module.exports = Hex;
