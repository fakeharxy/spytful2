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

  draw: function(ctx, drawPoints) {
    ctx.save();
    ctx.translate(this.centre.x, this.centre.y);
    ctx.beginPath();
    for (var i = 0; i < drawPoints.length; i++) {
      var pt = drawPoints[i];
      if (i === 0) {
        ctx.moveTo(pt[0], pt[1]);
      } else {
        ctx.lineTo(pt[0], pt[1]);
      }
      ctx.quadraticCurveTo(pt[2], pt[3], pt[4], pt[5]);
    }
    ctx.closePath();

    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(100,100,100,.7)";
    ctx.shadowOffsetX = 1.5;
    ctx.shadowOffsetY = 1.5;
    ctx.stroke();
    ctx.fillStyle = Hex.colourMap[this.colourCode];
    ctx.fill();


    //for water, draw the background image
    if (this.colourCode === 0) {
      ctx.clip(); // clip to the hex path on the context
      if (!this.waterOffset) {
        this.waterOffset = {
          x: -Board.hexSize - Math.random() * Board.hexSize,
          y: -Board.hexSize - Math.random() * Board.hexSize
        };
        this.waterRotate = Math.random() * 2 * Math.PI;
      }
      ctx.rotate(this.waterRotate);
      ctx.drawImage(ctx.imageCache.water, this.waterOffset.x, this.waterOffset.y, Board.hexSize *
        3, Board.hexSize * 3);

      //otherwise write the region name
    } else {
      ctx.shadowColor = "transparent";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#000";
      ctx.fillText(this.regionName, Board.offset - Board.hexSize, -Board.hexSize / 2);
    }

    //draw overlays
    var overlayImg = null;
    if (this.hasBriefcase) {
      overlayImg = ctx.imageCache["briefcase" + this.briefcaseValue];
    }
    if (overlayImg) {
      var iconWidth = Board.hexSize * 0.75;
      var iconHeight = iconWidth / overlayImg.width * overlayImg.height;
      ctx.shadowColor = "transparent";
      ctx.drawImage(overlayImg, -iconWidth / 2, -iconHeight / 2, iconWidth, iconHeight);
    }
    for (var i = 0; i < this.tokensOnHex.length; i++) {
      ctx.beginPath();
      var x = 7 * (i - 1);
      var y = 6;
      ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
      //console.log("x: " + x);
      //console.log("y: " + y);
      //console.log("token: " + this.tokensOnHex[i]);
      ctx.fillStyle = this.tokensOnHex[i];
      ctx.fill();
      ctx.stroke();
    }
    ctx.lineWidth = 1;
    ctx.shadowColor = "rgba(100,100,100,.7)";
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    for (var i = 0; i < this.outposts.length; i++) {
      if (this.outposts[i] !== '') {
        var j = (i + 1) % 6;
        ctx.fillStyle = this.outposts[i];
        ctx.beginPath();
        ctx.moveTo(Hex.corners[i][0] + Hex.outpostCorners[i][0].dx, Hex.corners[i][1] + Hex.outpostCorners[i][0].dy);
        ctx.lineTo(Hex.corners[i][0] + Hex.outpostCorners[i][1].dx, Hex.corners[i][1] + Hex.outpostCorners[i][1].dy);
        ctx.lineTo(Hex.corners[j][0] + Hex.outpostCorners[i][1].dx, Hex.corners[j][1] + Hex.outpostCorners[i][1].dy);
        ctx.lineTo(Hex.corners[j][0] + Hex.outpostCorners[i][0].dx, Hex.corners[j][1] + Hex.outpostCorners[i][0].dy);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      }
    }
    ctx.restore();
  },

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

  newOutpostValid: function (segment, colourCode) {
	// checks if a new outpost can be built on this segment
	// (by checking x2 neighbours of both relevant hexes)
	if (this.getOutpostAt(this.fixSegment(segment-1)) == colourCode ||
	  this.getOutpostAt(this.fixSegment(segment+1)) == colourCode) {
	  return false;
	}
	var oppHex = this.neighbours[segment];
	if (oppHex && (oppHex.getOutpostAt(this.fixSegment(segment+2)) == colourCode ||
	oppHex.getOutpostAt(this.fixSegment(segment+4)) == colourCode)) {
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
      return { centre: this.centre,
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