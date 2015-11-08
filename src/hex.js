var Hex = {
    colourCode: undefined,
    regionName: undefined,

    centre: undefined,
    corners: undefined,
    neighbours: [],

    colourMap: [	"#FFFFFF",
    "#78FF78",
    "#CBBC91",
    "#FFD1DC",
    "#FDFD7D",
    "#96CAFD",
    "#FFB347",
    "#BF94E4"	 ],

    draw: function (ctx) {
        ctx.fillStyle = Hex.colourMap[this.colourCode];
        ctx.beginPath();
        ctx.moveTo(this.corners[0].x, this.corners[0].y);
        for (var i = 1; i <= 5; i++) {
            ctx.lineTo(this.corners[i].x, this.corners[i].y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
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
