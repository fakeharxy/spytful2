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
        ctx.shadowColor= "rgba(100,100,100,.7)";
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 2;
        ctx.lineWidth = 2;
        ctx.fillStyle = Hex.colourMap[this.colourCode];

        ctx.beginPath();
        for (var i = 0; i < this.corners.length; i++) {
          var pt = this.corners[i];
          if (i == 0) {
            ctx.moveTo(pt[0], pt[1]);
          } else {
            ctx.lineTo(pt[0], pt[1]);
          }
          ctx.quadraticCurveTo(pt[2], pt[3], pt[4], pt[5]);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.strokeText(this.regionName, this.corners[2].x, this.corners[2].y); //fix!!
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
