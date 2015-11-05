var Hex = {
  colourCode: undefined,
  regionName: undefined,

  centre: undefined,
  corners: undefined,

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
    }
};
