function drawGame(ctx) {

  if (this.state == "setupPlayers") {
    //waiting for players
    ctx.font = "8pt Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.fillText("Waiting for players...", w / 2, h / 2);
    if (this.players && this.players.length>0) {
      for (var i in this.players) {
        ctx.fillText(this.players[i].name + " is ready", w / 2, h / 2 + i*15 + 20);
      }
    }
    
    
  
  
  } else {
    //draw everything
  
    //draw hexes
    drawBoard.call(this.board, ctx);

    //draw extraction route
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(50,50,255,0.7)';
    if (this.turnState == "extracting") {
      if (this.extractionRoute.length > 1) {
        ctx.beginPath();
        ctx.moveTo(this.extractionRoute[0].centre.x, this.extractionRoute[0].centre.y);
        for (var i = 1; i < this.extractionRoute.length; i++) {
          ctx.lineTo(this.extractionRoute[i].centre.x, this.extractionRoute[i].centre.y);
        }
        ctx.stroke();
      }
    }

    //draw deck
    drawDeck.call(this.deck, ctx, this.deckX, this.deckY);

    //draw scores
    var scoreX = this.deckX + (this.deck.cardWidth + this.deck.cardSpacing) * 3;
    var scoreY = this.deckY;
    ctx.font = 'bold 8pt Arial';
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = "#000";
    ctx.fillText("Scores", scoreX, scoreY);
    scoreY += 5;
    ctx.font = '8pt Arial';
    for (var i = 0; i < this.players.length; i++) {
      scoreY += 15;
      ctx.fillText(this.players[i].name + ": " + this.players[i].score, scoreX, scoreY);
    }

    //draw THIS player's hand (not the current player's)
    //this.players[this.currentPlayer].drawHand(ctx, this.handX, this.handY);
    //this.players[this.currentPlayer].drawStack(ctx, this.stackX, this.stackY, this.turnState == "extracting");
    drawHand.call(this.players[this.playerIndex], ctx, this.handX, this.handY);
    drawStack.call(this.players[this.playerIndex], ctx, this.stackX, this.stackY, this.turnState == "extracting");
  }
};