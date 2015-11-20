var Hex = {
    neighbours: [],

    colourMap: [	"#000099",
    "#78FF78",
    "#CBBC91",
    "#FFD1DC",
    "#FDFD7D",
    "#96CAFD",
    "#FFB347",
    "#BF94E4"	 ],

	draw: function (ctx, drawPoints) {
		ctx.save();
		ctx.translate(this.centre.x, this.centre.y);
		ctx.beginPath();
		for (var i = 0; i < drawPoints.length; i++) {
			var pt = drawPoints[i];
			if (i == 0) {
				ctx.moveTo(pt[0], pt[1]);
			} else {
				ctx.lineTo(pt[0], pt[1]);
			}
			ctx.quadraticCurveTo(pt[2], pt[3], pt[4], pt[5]);
		}
		ctx.closePath();

		ctx.lineWidth = 2;
		ctx.shadowColor= "rgba(100,100,100,.7)";
		ctx.shadowOffsetX = 3;
		ctx.shadowOffsetY = 2;
		ctx.stroke();
		ctx.fillStyle = Hex.colourMap[this.colourCode];
		ctx.fill();


		//for water, draw the background image
		if (this.colourCode==0) {
			ctx.clip(); // clip to the hex path on the context
            if (!this.waterOffset) {
				this.waterOffset = { x: - Board.hexSize - Math.random() * Board.hexSize, y: - Board.hexSize - Math.random() * Board.hexSize };
				this.waterRotate = Math.random() * 2 * Math.PI;
			}
			ctx.rotate(this.waterRotate);
			ctx.drawImage(ctx.imageCache["water"], this.waterOffset.x, this.waterOffset.y, Board.hexSize * 3, Board.hexSize * 3);

		//otherwise write the region name
		} else {
			ctx.shadowColor = "transparent";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
			ctx.fillStyle = "#000"
			ctx.fillText(this.regionName, Board.offset - Board.hexSize, -Board.hexSize/2);
		}

		//draw overlays
    var overlayImg = null;
		if (this.hasBriefcase) {
      overlayImg = ctx.imageCache["briefcase"];
    } else if (this.isExtractionpoint) {
      overlayImg = ctx.imageCache["extractionpoint"];
    }
    if (overlayImg) {
			var iconWidth = Board.hexSize * 0.75;
      var iconHeight = iconWidth / overlayImg.width * overlayImg.height;
			ctx.shadowColor = "transparent";
			ctx.drawImage(overlayImg, - iconWidth/2, - iconHeight/2, iconWidth, iconHeight);
		}

		ctx.restore();
	},


	setValidColour: function () {
			//find invalid colours based on neighbours
			var invalid = [];
			for (var i=0; i<this.neighbours.length; i++) {
					var hex = this.neighbours[i];
					if (hex.colourCode !== undefined) {
							invalid.push(hex.colourCode);
					}
			}
			//build valid list
			var valid = [];
			for (var i=0; i<Hex.colourMap.length; i++) {
					if (invalid.indexOf(i) == -1) {
							valid.push(i);
					}
			}
			if (valid.length > 0) {
					//pick randomly from remaining valid colour codes
					var index = Math.floor(Math.random() * valid.length);
					this.colourCode = valid[index];
			} else {
					console.log ("error: no valid colours left for a hex");
			}
	}
};
