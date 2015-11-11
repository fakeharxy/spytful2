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

    draw: function (ctx) {
      
        ctx.beginPath();
        for (var i = 0; i < this.drawPoints.length; i++) {
          var pt = this.drawPoints[i];
          if (i == 0) {
            ctx.moveTo(pt[0], pt[1]);
          } else {
            ctx.lineTo(pt[0], pt[1]);
          }
          ctx.quadraticCurveTo(pt[2], pt[3], pt[4], pt[5]);
        }
        ctx.closePath();
        
        ctx.lineWidth = 2;
		
		ctx.stroke();
		
		//for water, draw the background image
		if (this.colourCode==0) {
			ctx.save();
			ctx.clip(); // clip to whatever path is on the context

			//var imgHeight = Board.hexSize * 2 / img.width * img.height;
			//if (imgHeight < h){
			//	ctx.fillStyle = '#000';
			//	ctx.fill();
			//}
			ctx.drawImage(ctx.imageCache[0],this.corners[3][0] - Math.random() * Board.hexSize, this.corners[4][1] - Math.random() * Board.hexSize, Board.hexSize * 3, Board.hexSize * 3);
			ctx.restore();
			
			
		//otherwise fill with colour and write the name
		} else {
			ctx.shadowColor= "rgba(100,100,100,.7)";
			ctx.shadowOffsetX = 3;
			ctx.shadowOffsetY = 2;
			ctx.fillStyle = Hex.colourMap[this.colourCode];
			ctx.fill();
			ctx.shadowColor = "transparent";
			ctx.lineWidth = 1;
			ctx.textBaseline = 'top';
			ctx.strokeText(" " + this.regionName, this.corners[3][0], this.corners[3][1]);
		}
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
