var Card = {
  draw: function (ctx, x, y, faceUp) {
    ctx.save();

    ctx.strokeStyle = "rgba(0,0,0,0.7)";
    ctx.translate(x + this.wobble.x + this.focusOffsetX, y + this.wobble.y + this.focusOffsetY);
    ctx.rotate(this.rotation);
    ctx.shadowColor = "transparent";

    ctx.beginPath();
    for (var i = 0; i < game.deck.drawPoints.length; i++) {
      var pt = game.deck.drawPoints[i];
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
    ctx.fillStyle = faceUp ? game.board.hexColourMap[this.hex.colourCode] :
      "#FFF";
    ctx.fill();

    //write region name
    if (faceUp) {
      ctx.fillStyle = "#000";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText(
        this.hex.regionName,
        game.deck.cardWidth / 2,
        game.deck.cardHeight / 2);
    } else {
      ctx.drawImage(
        ctx.imageCache.logo,
        2.5,
        2.5,
        game.deck.cardWidth - 5,
        game.deck.cardHeight - 5);
    }
    ctx.restore();
  }
};