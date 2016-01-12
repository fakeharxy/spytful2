var Game = {
  briefcasesPerPlayer: 3,
  extractionpointsPerPlayer: 1,
  startCardsPool: 2,
  startCardsPlayer: 2,
  state: "setupBoard",
  turnState: "pre-start",
  extractionRoute: [],
  focusObj: null,

  setup: function(boardWidth, boardHeight) {
    if (this.state != "setupBoard") {
      alert("error: board already set up");
      return;
    }
    this.board = Object.create(Board);
    this.board.buildBoard(boardWidth, boardHeight);

    this.deck = Object.create(Deck);
    this.deck.buildDeck(this.board.hexArray);
    Deck.shuffle(this.deck.cardArray);

    this.players = [];

    this.setupCoordinates();

    this.state = "setupPlayers";
  },

  setupCoordinates: function() {
    //deck is positioned a little to the right of the hexes
    this.deckX = 2 * (this.board.width * this.board.hexSize + this.board.firstHexX);
    this.deckY = this.board.firstHexY - this.board.hexSize;

    //current player's hand is positioned below the deck
    this.handX = this.deckX;
    this.handY = this.deckY + (this.deck.cardHeight + 2 * this.deck.cardSpacing);

    //current player's movement stack is positioned below the hand
    this.stackX = this.deckX;
    this.stackY = this.deckY + 2 * (this.deck.cardHeight + 2 * this.deck.cardSpacing);
  },

  addPlayer: function(name) {
    if (this.state != "setupPlayers") {
      alert("error: game not in player setup stage");
      return;
    }
    var player = Object.create(Player);
    player.name = name;
    player.number = this.players.length + 1;
    player.setup();
    this.players.push(player);
  },

  prepareGame: function() {
    if (this.state != "setupPlayers") {
      alert("error: game not in setup stage");
      return;
    }
    if (this.players.length < 2) {
      alert("error: not enough players to start game");
      return;
    }

    //add briefcases and extraction points
    var validHexes = [];
    for (var j = 0; j < this.board.height; j++) {
      for (var i = 0; i < this.board.width; i++) {
        if (this.board.hexArray[j][i].colourCode !== 0) {
          validHexes.push(this.board.hexArray[j][i]);
        }
      }
    }
    var briefcaseCount = this.players.length * Game.briefcasesPerPlayer;
    var extractionpointCount = this.players.length * Game.extractionpointsPerPlayer;
    if (validHexes.length < briefcaseCount + extractionpointCount) {
      alert("too many players on too small a board; tests don't count");
      return;
    }
    Deck.shuffle(validHexes);
    var briefcaseValue = 1;
    for (var i = 0; i < briefcaseCount; i++) {
      var hex = validHexes.shift();
      hex.hasBriefcase = true;
      hex.briefcaseValue = briefcaseValue;
      if (++briefcaseValue > 3) {
        briefcaseValue = 1;
      }
    }
    for (var i = 0; i < extractionpointCount; i++) {
      validHexes.shift().isExtractionpoint = true;
    }


    //deal cards into the card pool
    this.deck.deal(this.deck.cardPool, this.startCardsPool);

    // deal cards to each player
    for (var i = 0; i < this.players.length; i++) {
      this.deck.deal(this.players[i].hand, this.startCardsPlayer);
    }

    //start first turn
    this.currentPlayer = 0;
    this.turnState = "playing";
    this.state = "started";
  },

  nextTurn: function() {
    if (++this.currentPlayer >= this.players.length) {
      this.currentPlayer = 0;
    }
    this.turnState = 'playing';
  },

  draw: function() {

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);

    //draw hexes
    this.board.drawBoard(ctx);

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
    this.deck.draw(ctx, this.deckX, this.deckY);

    //draw scores
    var scoreX = this.deckX + (Deck.cardWidth + Deck.cardSpacing) * 3;
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

    //draw current player's hand
    this.players[this.currentPlayer].drawHand(ctx, this.handX, this.handY);
    this.players[this.currentPlayer].drawStack(ctx, this.stackX, this.stackY, this.turnState ==
      "extracting");
  },

  onclick: function(x, y) {
    var loc = this.locateMouse(x, y);
    if (loc == "board") {
      if (this.turnState == "extracting") {
        var clickedHex = this.board.determineClick(x, y);
        if (clickedHex != undefined) {
          //check if clicked hex is a neighbour of the previous
          var hexNeighbourSegment = this.extractionRoute[this.extractionRoute.length - 1].getNeighbourSegment(
            clickedHex);
          if (hexNeighbourSegment !== -1) {
            //check if there is an outpost
            var outpostColour = this.extractionRoute[this.extractionRoute.length - 1].getOutpostAt(
              hexNeighbourSegment);
            if (outpostColour == '' || outpostColour == this.players[this.currentPlayer].colour) {
              //check if it matches next card in movement stack
              if (this.players[this.currentPlayer].stack[this.extractionRoute.length]
                .hex.colourCode == clickedHex.colourCode) {
                this.extractionRoute.push(clickedHex);
                this.draw();
              } else {
                alert(
                  "the next hex must match the colour of the next card in your movement stack"
                );
              }
            } else {
              alert(
                " You cannot move through another player's outpost (the rules dictate this)");
            }
          } else {
            alert("you can only continue movement to an adjacent hex");
          }
        }
      } else if (this.turnState == 'playing') {
        var clickedHex = this.board.determineClick(x, y);
        if (clickedHex !== undefined) {
          var segmentClicked = clickedHex.determineSegment(x, y);
          var outpost = clickedHex.getOutpostAt(segmentClicked);
          if (outpost !== 'invalid') {
            if (outpost == '') {
			  if (clickedHex.newOutpostValid(segmentClicked, this.players[this.currentPlayer].colour)) {
                clickedHex.setOutpostAt(segmentClicked, this.players[this.currentPlayer].colour);
                this.turnState = "outposting";
                this.outpostHex = clickedHex;
                this.outpostSegment = segmentClicked;
                this.draw();
			  } else {
				  alert("The rules insist that you cannot place an outpost adjacent to an existing outpost (of your own)");
			  }
            } else if (outpost == this.players[this.currentPlayer].colour) {
              clickedHex.removeOutpostAt(segmentClicked);
              this.draw();
            } else {
              alert("The rules dictate that you cannot conquer existing outposts! ");
            }
          }
        }
      } else if (this.turnState == 'outposting') {
        var clickedHex = this.board.determineClick(x, y);
        if (clickedHex !== undefined) {
          var segmentClicked = clickedHex.determineSegment(x, y);
          if (segmentClicked == this.outpostSegment && this.outpostHex == clickedHex) {
            clickedHex.removeOutpostAt(segmentClicked);
            this.draw();
            this.turnState = 'playing';
          } else if (clickedHex.neighbours[segmentClicked] == this.outpostHex && Hex.fixSegment(segmentClicked + 3) == this.outpostSegment) {
            clickedHex.removeOutpostAt(segmentClicked);
            this.draw();
            this.turnState = 'playing';
          }
        }
      }
    } else if (loc == "deck") {
      if (this.turnState == "playing") {
        var poolDeckCardIndex = this.deck.determineClick(x - this.deckX, y - this.deckY);
        if (poolDeckCardIndex < this.deck.cardPool.length) {
          this.updateFocus(null);
          this.drawCardsFromPool();
        } else if (poolDeckCardIndex === this.deck.cardPool.length) {
          this.updateFocus(null);
          this.drawCardFromDeck();
        }
      } else {
        alert("The rules state that you can only draw cards once a turn");
      }
    } else if (loc == "hand") {
      if (this.turnState == "playing") {
        var handCardIndex = this.players[this.currentPlayer].determineClick(x - this.handX,
          y -
          this.handY);
        if (handCardIndex < this.players[this.currentPlayer].hand.length) {
          this.updateFocus(null);
          this.players[this.currentPlayer].playCardToStack(handCardIndex);
          this.draw();
        }
      } else if (this.turnState == "outposting") {
        var handCardIndex = this.players[this.currentPlayer].determineClick(x - this.handX,
          y -
          this.handY);
        if (handCardIndex < this.players[this.currentPlayer].hand.length) {
          var clickedCardColour = this.players[this.currentPlayer].hand[handCardIndex].hex.colourCode;
          if (clickedCardColour == this.outpostHex.colourCode || clickedCardColour == this.outpostHex
            .neighbours[this.outpostSegment].colourCode) {
            this.players[this.currentPlayer].hand.splice(handCardIndex, 1);
            this.draw();
            this.turnState = "playing";
          } else {
            alert(
              "I'm afraid that card can't be used for this outpost. Either pick a card that can or cancel the outpost by clicking it again."
            );
          }
        }
      } else {
        alert(
          "The rules state that once you have drawn cards, you can no longer play actions"
        );
      }
    } else if (loc == "stack") {
      if (this.turnState == "playing") {
        if (this.players[this.currentPlayer].stack.length > 0) {
          //TODO confirm start of extraction with user?
          this.turnState = "extracting";
          this.extractionRoute = [this.players[this.currentPlayer].stack[0].hex];
          this.draw();
        } else {
          alert(
            "The rules don't even need to specify that you can't start extraction without a movement stack"
          );
        }
      }
    } else {
      console.log("clicked somewhere unknown");
    }
  },

  checkIfGameEnd: function() {
    if (this.deck.cardPool.length === 0 && this.deck.cardArray.length === 0) {
      this.state = 'finished';
    }
  },

  determineWinner: function() {
    var highest = -1;
    var topPlayer;
    var tieList = [];
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].score > highest) {
        highest = this.players[i].score;
        topPlayer = this.players[i];
        var tieList = [];
      } else if (this.players[i].score == highest) {
        if (this.players[i].briefcaseCount > topPlayer.briefcaseCount) {
          topPlayer = this.players[i];
          var tieList = [];
        } else if (this.players[i].briefcaseCount == topPlayer.briefcaseCount) {
          tieList.push(this.players[i]);
        }
      }
    }

    var message;
    if (tieList.length > 0) {
      message = "The game was a tie: " + topPlayer.name;
      for (var i = 0; i < tieList.length; i++) {
        message += ", " + tieList[i].name;
      }
      message += " all";
    } else {
      message = topPlayer.name + " has won. They";
    }
    message += " got " + highest + " points (" + topPlayer.briefcaseCount +
      " briefcases).";

    alert(message);

  },

  completeExtraction: function() {
    if (this.turnState == "extracting") {
      if (this.extractionRoute[this.extractionRoute.length - 1].isExtractionpoint) {
        //go through extraction route and collect points, reset hexes
        var points = 0;
        var briefcases = 0;
        for (var i = 0; i < this.extractionRoute.length; i++) {
          var hex = this.extractionRoute[i];
          if (hex.hasBriefcase) {
            briefcases++;
            points += hex.briefcaseValue;
            hex.hasBriefcase = false;
          }
        }
        this.players[this.currentPlayer].score += points; //add points to player's total
        this.players[this.currentPlayer].briefcaseCount += briefcases;
        alert("you just collected " + points + " points, bringing your total to " + this.players[
          this.currentPlayer].score);
        this.clearRoute();
        this.draw();
      } else {
        alert("the rules require that movement must end on an extraction point");
      }
    } else {
      alert("logic suggests that to finish extraction you must first start extraction");
    }
  },

  onmousemove: function(x, y) {
    var loc = this.locateMouse(x, y);
    if (loc == "board") {
      this.updateFocus(null);
    } else if (loc == "deck") {
      var poolDeckCardIndex = this.deck.determineClick(x - this.deckX, y - this.deckY);
      if (poolDeckCardIndex < this.deck.cardPool.length) {
        this.updateFocus(this.deck.cardPool);
      } else if (poolDeckCardIndex == this.deck.cardPool.length) {
        this.updateFocus(this.deck.cardArray[0]);
      } else {
        this.updateFocus(null);
      }
    } else if (loc == "hand") {
      var handCardIndex = this.players[this.currentPlayer].determineClick(x - this.handX,
        y -
        this.handY);
      if (handCardIndex < this.players[this.currentPlayer].hand.length) {
        this.updateFocus(this.players[this.currentPlayer].hand[handCardIndex]);
      } else {
        this.updateFocus(null);
      }
    } else if (loc == "stack") {
      this.updateFocus(null);
    } else {
      this.updateFocus(null);
    }
  },

  updateFocus: function(obj) {
    if (this.focusObj === obj) {
      //still moving over same object
    } else {
      //move focus to new object
      if (this.focusObj) {
        this.focusObj.focusOffsetX = 0;
        this.focusObj.focusOffsetY = 0;
      }
      if (obj) {
        obj.focusOffsetX = -7;
        obj.focusOffsetY = -12;
      }
      this.focusObj = obj;
      this.draw();
    }
  },

  locateMouse: function(x, y) {
    //locate co-ordinates
    if (x < this.deckX) {
      return "board";
    } else if (y < this.handY) {
      return "deck";
    } else if (y < this.stackY) {
      return "hand";
    } else {
      return "stack";
    }
  },

  clearRoute: function() {
    game.players[game.currentPlayer].clearRoute();
    if (this.turnState == "extracting") {
      //cancel extraction
      this.turnState = "playing";
    }
  },

  drawCardFromDeck: function() {
    if (game.players[game.currentPlayer].hand.length < Player.maxHandSize) {
      game.players[game.currentPlayer].drawCardFromDeck();
      this.turnState = "finished";
      this.draw();
    } else {
      alert("There is no room in your hand. Play some cards first");
    }
  },

  drawCardsFromPool: function() {
    if (game.players[game.currentPlayer].hand.length < Player.maxHandSize - 1) {
      game.players[game.currentPlayer].drawCardsFromPool();
      this.turnState = "finished";
      this.draw();
    } else {
      alert("There is no room in your hand. Play some cards first");
    }
  }
};
