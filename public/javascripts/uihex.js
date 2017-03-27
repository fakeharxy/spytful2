var Hex = {
  draw: function (ctx, drawPoints) {
    ctx.save();
    ctx.translate(Math.round(this.centre.x), Math.round(this.centre.y));
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
    ctx.fillStyle = game.board.hexColourMap[this.colourCode];
    ctx.fill();


    //for water, draw the background image
    if (this.colourCode === 0) {
      ctx.clip(); // clip to the hex path on the context
      ctx.rotate(this.waterRotate);
      ctx.drawImage(ctx.imageCache.water, this.waterOffset.x, this.waterOffset.y, game.board.hexSize *
        3, game.board.hexSize * 3);

      //otherwise write the region name
    } else {
      ctx.shadowColor = "transparent";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000";
      ctx.fillText(this.regionName, 0, -game.board.hexSize / 7 * 4);
    }

    //draw overlays
    var overlayImg = null;
    if (this.hasBriefcase) {
      overlayImg = ctx.imageCache["briefcase" + this.briefcaseValue];
    }
    if (overlayImg) {
      var iconWidth = game.board.hexSize * 0.5625;
      var iconHeight = iconWidth / overlayImg.width * overlayImg.height;
      //ctx.shadowColor = "transparent";
      var iconX = -iconWidth / 2;
      var iconY = -iconHeight / 2;
      ctx.drawImage(overlayImg, iconX, iconY, iconWidth, iconHeight);
      if (this.ownerColour != -1) {
        ctx.beginPath();
        var pinSize = 2;
        ctx.rect(iconX + pinSize, iconY + pinSize, iconWidth - pinSize*2, iconHeight - pinSize*2);
        ctx.fillStyle = this.ownerColour;
        ctx.fill();
        ctx.stroke();
      }
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
        ctx.moveTo(game.board.hexCorners[i][0] + game.board.hexOutpostCorners[i][0].dx, game.board.hexCorners[i][1] + game.board.hexOutpostCorners[i][0].dy);
        ctx.lineTo(game.board.hexCorners[i][0] + game.board.hexOutpostCorners[i][1].dx, game.board.hexCorners[i][1] + game.board.hexOutpostCorners[i][1].dy);
        ctx.lineTo(game.board.hexCorners[j][0] + game.board.hexOutpostCorners[i][1].dx, game.board.hexCorners[j][1] + game.board.hexOutpostCorners[i][1].dy);
        ctx.lineTo(game.board.hexCorners[j][0] + game.board.hexOutpostCorners[i][0].dx, game.board.hexCorners[j][1] + game.board.hexOutpostCorners[i][0].dy);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      }
    }
    ctx.restore();
  }
};
