var Game = {
  draw: function(ctx) {
    if (this.state == "setupPlayers") {
      //waiting for players
      ctx.font = "8pt Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeStyle = "black";
      ctx.fillStyle = "black";
      ctx.fillText("Waiting for players...", w / 2, h / 2);
      if (this.players && this.players.length > 0) {
        for (var i in this.players) {
          ctx.fillText(this.players[i].name + " is ready", w / 2, h / 2 + i * 15 + 20);
        }
      }

    } else {
      //draw everything

      //draw hexes
      Board.draw.call(this.board, ctx);

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
      Deck.draw.call(this.deck, ctx, this.deckX, this.deckY);

      //draw scores
      var scoreX = this.deckX + (this.deck.cardWidth + this.deck.cardSpacing) * (this.deck.maxCardsInPool +
        1);
      var scoreY = this.deckY;
      ctx.font = 'bold 8pt Arial';
      ctx.textBaseline = "top";
      ctx.textAlign = "left";
      ctx.fillStyle = "#000";
      ctx.fillText("Scores", scoreX, scoreY);
      scoreY += 5;
      ctx.font = '8pt Arial';
      playersInOrder = this.players.slice();
      playersInOrder.sort(compare);

      function compare(a, b) {
        if (a.score < b.score)
          return 1;
        if (a.score > b.score)
          return -1;
        return 0;
      }

      for (var i = 0; i < playersInOrder.length; i++) {
        scoreY += 15;
        //        ctx.beginPath();
        //       ctx.arc(scoreX, scoreY, 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = playersInOrder[i].colour;
        // ctx.fill();
        // ctx.stroke();

        ctx.fillText(playersInOrder[i].number + ". " + playersInOrder[i].name + ": " + playersInOrder[i].score, scoreX, scoreY);
      }

      ctx.fillStyle = "#000";
      //draw THIS player's hand (not the current player's)
      //this.players[this.currentPlayer].drawHand(ctx, this.handX, this.handY);
      //this.players[this.currentPlayer].drawStack(ctx, this.stackX, this.stackY, this.turnState == "extracting");
      //if (this.players[playerIndex]) {
      //  Player.drawHand.call(this.players[playerIndex], ctx, this.handX, this.handY, true);
      //  Player.drawStack.call(this.players[playerIndex], ctx, this.stackX, this.stackY, true); //can now always see your own stack
      //}

      var oppScale = 0.75;
      var oppX = scoreX + (this.deck.cardWidth + this.deck.cardSpacing) * 2;
      var oppY = this.deckY;
      for (var i = 0; i < this.players.length; i++) {
        if (i == playerIndex) {
          Player.drawHand.call(this.players[i], ctx, this.handX, this.handY, true);
          Player.drawStack.call(this.players[i], ctx, this.stackX, this.stackY, true);
        } else {
          Player.drawHand.call(this.players[i], ctx, oppX, oppY, false, oppScale);
          Player.drawStack.call(this.players[i], ctx, oppX, oppY + (this.deck.cardHeight *
            oppScale) + this.deck.cardSpacing * 1.5, false, oppScale);
          oppY += ((this.deck.cardHeight * oppScale) + this.deck.cardSpacing * 2) * 2;
        }
      }
    }
  }
};
