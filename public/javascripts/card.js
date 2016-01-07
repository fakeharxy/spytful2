var Card = {
  focusOffsetX: 0,
  focusOffsetY: 0,

  draw: function(ctx, x, y, faceUp) {
    ctx.save();

    ctx.strokeStyle = "rgba(0,0,0,0.7)";
    ctx.translate(x + this.wobble.x + this.focusOffsetX, y + this.wobble.y + this.focusOffsetY);
    ctx.rotate(this.rotation);
    ctx.shadowColor = "transparent";

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
    ctx.stroke();
    ctx.fillStyle = faceUp ? Hex.colourMap[this.hex.colourCode] :
      "#FFF";
    ctx.fill();

    //write region name
    if (faceUp) {
      ctx.fillStyle = "#000";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(
        this.hex.regionName,
        Deck.cardWidth / 2,
        Deck.cardHeight / 2);
    } else {
      ctx.drawImage(
        ctx.imageCache.logo,
        2.5,
        2.5,
        Deck.cardWidth - 5,
        Deck.cardHeight - 5);
    }
    ctx.restore();
  }
};
