var Rules = require('./rules.js');
var Board = require('./board.js');
var Deck = require('./deck.js');
var Player = require('./player.js');
var Hex = require('./hex.js');

var Game = {
  deckCardDrawn: false,
  cardDrawnCount: 0,
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
    this.deckX = this.board.firstHexX * 2 + this.board.width * (this.board.hexSize + this.board
      .offset) * Math.sqrt(3);
    this.deckY = this.board.firstHexY - this.board.hexSize;

    //current player's hand is positioned below the deck
    this.handX = this.deckX;
    this.handY = this.deckY + (this.deck.cardHeight + 2 * this.deck.cardSpacing);

    //current player's movement stack is positioned below the hand
    this.stackX = this.deckX;
    this.stackY = this.deckY + 2 * (this.deck.cardHeight + 2 * this.deck.cardSpacing);
  },

  addPlayer: function(uid, name) {
    if (this.state != "setupPlayers") {
      console.log("error: game not in player setup stage");
      return false;
    }
    if (this.getPlayerIndex(uid) > -1) {
      console.log("error: player already in game");
      return false;
    }

    var player = Object.create(Player);
    player.uid = uid;
    player.name = name;
    player.number = this.players.length + 1;
    player.setup();
    this.players.push(player);
    return true;
  },

  getPlayerIndex: function(uid) {
    for (var i in this.players) {
      if (this.players[i].uid == uid) {
        return i;
      }
    }
    return -1;
  },

  prepareGame: function(alert) {
    if (this.state != "setupPlayers") {
      alert("error: game not in setup stage");
      return false;
    }
    if (this.players.length < 2) {
      alert("error: not enough players to start game");
      return false;
    }

    //add briefcases
    var validHexes = [];
    for (var j = 0; j < this.board.height; j++) {
      for (var i = 0; i < this.board.width; i++) {
        if (this.board.hexArray[j][i].colourCode !== 0) {
          validHexes.push(this.board.hexArray[j][i]);
        }
      }
    }
    this.briefcaseCount = this.players.length * Rules.briefcasesPerPlayer;
    if (validHexes.length < this.briefcaseCount) {
      alert("too many players on too small a board; tests don't count");
      return false;
    }
    Deck.shuffle(validHexes);
    var briefcaseValue = Rules.minPointsPerBriefcase;
    for (var i = 0; i < this.briefcaseCount; i++) {
      var hex = validHexes.shift();
      hex.hasBriefcase = true;
      hex.briefcaseValue = briefcaseValue;
      if (++briefcaseValue > Rules.maxPointsPerBriefcase) {
        briefcaseValue = Rules.minPointsPerBriefcase;
      }
    }

    //deal cards into the card pool
    this.deck.deal(this.deck.cardPool, Rules.startCardsPool);

    // deal cards to each player
    for (var i = 0; i < this.players.length; i++) {
      this.deck.deal(this.players[i].hand, Rules.startCardsPlayer);
    }

    //start first turn
    this.currentPlayer = 0;
    this.turnState = "playing";
    this.turnOutpostsSet = 0;
    this.state = "started";

    return true;
  },

  nextTurn: function() {
    if (++this.currentPlayer >= this.players.length) {
      this.currentPlayer = 0;
    }
    //this.deck.deal(this.deck.cardPool, Rules.maxCardsInPool - this.deck.cardPool.length);
    for (var i=0; i<Rules.maxCardsInPool; i++) {
      if (!this.deck.cardPool[i]) {
        this.deck.cardPool[i] = this.deck.cardArray.splice(0,1)[0];
      }
    }
    this.turnOutpostsSet = 0;
    this.turnState = 'playing';
    this.deckCardDrawn = false;
    this.cardDrawnCount = 0;
  },

  onclick: function(x, y, alert) {
    var loc = this.locateMouse(x, y);
    if (loc == "board") {
      if (this.turnState == "extracting") {
        var clickedHex = this.board.determineClick(x, y);
        if (clickedHex != undefined) {
          //check if there is another card in the player's stack
          if (this.players[this.currentPlayer].stack.length > this.extractionRoute.length) {
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
                  //this.draw();
                  return true;
                } else {
                  alert(
                    "the next hex must match the colour of the next card in your movement stack"
                  );
                }
              } else {
                alert(
                  "You cannot move through another player's outpost (the rules dictate this)"
                );
              }
            } else {
              alert("you can only continue movement to an adjacent hex");
            }
          } else {
            alert("you don't have any more cards in your movement stack");
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
                if (this.turnOutpostsSet < Rules.maxOutpostsPerTurn) {
                  if (this.players[this.currentPlayer].outposts < Rules.maxOutpostsPerPlayer) {
                    clickedHex.setOutpostAt(segmentClicked, "#FFFFFF"); //provisional outpost
                    this.turnState = "outposting";
                    this.outpostHex = clickedHex;
                    this.outpostSegment = segmentClicked;
                    //this.draw();
                    return true;
                  } else {
                    alert(
                      "The rules preclude having too many outposts. You must remove an existing outpost before you can place another."
                    );
                  }
                } else {
                  alert(
                    "The rules prohibit playing too many outposts in one turn. You have already reached the limit."
                  );
                }
              } else {
                alert(
                  "The rules insist that you cannot place an outpost adjacent to an existing outpost (of your own)"
                );
              }
            } else if (outpost == this.players[this.currentPlayer].colour) {
              //TODO: add confirmation mechanism
              //if (confirm("Are you sure you want to permanently remove this outpost?")) {
              clickedHex.removeOutpostAt(segmentClicked);
              this.players[this.currentPlayer].outposts--;
              //this.draw();
              return true;
              //}
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
            this.turnState = 'playing';
            //this.draw();
            return true;
          } else if (clickedHex.neighbours[segmentClicked] == this.outpostHex && Hex.fixSegment(
              segmentClicked + 3) == this.outpostSegment) {
            clickedHex.removeOutpostAt(segmentClicked);
            this.turnState = 'playing';
            //this.draw();
            return true;
          }
        }
      } else {
        alert('you cannot do this now; you are ' + this.turnState);
      }
    } else if (loc == "deck") {
      if (this.turnState == "playing" || this.turnState == "drawing") {
        var poolDeckCardIndex = this.deck.determineClick(x - this.deckX, y - this.deckY);
        if (poolDeckCardIndex < this.deck.cardPool.length) {
          this.updateFocus(null);
          // return this.drawCardsFromPool(alert);
          return this.drawCardFromPool(poolDeckCardIndex, alert);
        } else if (poolDeckCardIndex == Rules.maxCardsInPool) {
          this.updateFocus(null);
          return this.drawCardFromDeck(alert);
        }
      } else {
        if (this.turnState == "extracting") {
          alert("you cannot do this now; you are " + this.turnState);
        } else {
          alert("The rules state that you can only draw cards once a turn");
        }
      }
    } else if (loc == "hand") {
      if (this.turnState == "playing") {
        var handCardIndex = this.players[this.currentPlayer].determineClick(x - this.handX, y -
          this.handY);
        if (handCardIndex < this.players[this.currentPlayer].hand.length) {
          this.updateFocus(null);
          this.players[this.currentPlayer].playCardToStack(handCardIndex, alert);
          //this.draw();
          return true;
        }
      } else if (this.turnState == "outposting") {
        var handCardIndex = this.players[this.currentPlayer].determineClick(x - this.handX,
          y - this.handY);
        if (handCardIndex < this.players[this.currentPlayer].hand.length) {
          var clickedCardColour = this.players[this.currentPlayer].hand[handCardIndex].hex.colourCode;
          if (clickedCardColour == this.outpostHex.colourCode || clickedCardColour == this.outpostHex
            .neighbours[this.outpostSegment].colourCode) {
            this.players[this.currentPlayer].hand.splice(handCardIndex, 1);
            this.outpostHex.setOutpostAt(this.outpostSegment, this.players[this.currentPlayer].colour); //finalise outpost
            this.players[this.currentPlayer].outposts++;
            this.turnOutpostsSet++;
            this.turnState = "playing";
            //this.draw();
            return true;
          } else {
            alert(
              "I'm afraid that card can't be used for this outpost. Either pick a card that can or cancel the outpost by clicking it again."
            );
          }
        }
      } else {
        if (this.turnState == "extracting") {
          alert("you cannot do this now; you are " + this.turnState);
        } else {
          alert("The rules state that once you have drawn cards, you can no longer play actions");
        }
      }
    } else if (loc == "stack") {
      if (this.turnState == "playing") {
        if (this.players[this.currentPlayer].stack.length > 0) {
          //TODO confirm start of extraction with user?
          this.turnState = "extracting";
          this.extractionRoute = [this.players[this.currentPlayer].stack[0].hex];
          //this.draw();
          return true;
        } else {
          alert(
            "The rules don't even need to specify that you can't start extraction without a movement stack"
          );
        }
      } else if (this.turnState == "extracting") {
          //TODO confirm cancel extraction?
          this.turnState = "playing";
          this.extractionRoute = [];
          return true;
      } else {
          alert('you cannot do this now; perhaps you have already drawn cards');
      }
    } else {
      console.log("clicked somewhere unknown");
    }
  },

  endTurn: function(alert) {
    if (this.turnState == 'finished' || this.turnState == 'drawing') {
      this.checkIfGameEnd();
      return true;
    } else {
      alert("The game rules dictate you must draw cards before ending your turn...");
    }
  },

  checkIfGameEnd: function() {
    var poolIsEmpty = true;
    for (var i=0; i<this.deck.cardPool.length; i++) {
      if (this.deck.cardPool.length) {
        poolIsEmpty = false;
        break;
      }
    }
    if ((poolIsEmpty && this.deck.cardArray.length === 0) || this.briefcaseCount === 0) {
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
    message += " got " + highest + " points (" + topPlayer.briefcaseCount + " briefcases).";

    return message;

  },

  completeExtraction: function(alert) {
    if (this.turnState == "extracting") {
      if (this.players[this.currentPlayer].stack[this.extractionRoute.length - 1]
        .hex.regionName == this.extractionRoute[this.extractionRoute.length - 1].regionName) {
        //go through extraction route and collect points, reset hexes
        var scoreSummary = "Scoring";
        var points = 0;
        var briefcases = 0;
        var briefcaseBonus = 0;
        for (var i = 0; i < this.extractionRoute.length; i++) {
          var hex = this.extractionRoute[i];
          if (hex.hasBriefcase) {
            briefcases++;
            points += hex.briefcaseValue + briefcaseBonus;
            scoreSummary += " // briefcase " + briefcases + " value: " + hex.briefcaseValue + " bonus: " + briefcaseBonus + " points: " + (hex.briefcaseValue + briefcaseBonus);
            briefcaseBonus += Rules.briefcaseBonusAccumulator;
            hex.hasBriefcase = false;
            this.briefcaseCount--;
          }
        }
        if (briefcases>0) { //add points for route length
          points += Rules.pointsPerHex * this.extractionRoute.length;
          scoreSummary += " // route length: " + this.extractionRoute.length + " points: " + (Rules.pointsPerHex * this.extractionRoute.length);
        }
        alert(scoreSummary + " // total: " + points);
        this.players[this.currentPlayer].score += points; //add points to player's total
        this.players[this.currentPlayer].briefcaseCount += briefcases;
        alert("you just collected " + points + " points, bringing your total to " + this.players[
          this.currentPlayer].score);
        this.clearRoute();
        //this.draw();
        return true;
      } else {
        alert("the rules require the correct region card to extract");
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
    this.players[this.currentPlayer].clearRoute();
    if (this.turnState == "extracting") {
      //cancel extraction
      this.turnState = "playing";
    }
    return true;
  },

  clearHand: function() {
    this.players[this.currentPlayer].clearHand();
    return true;
  },

  drawCardFromDeck: function(alert) {
    if (this.deckCardDrawn == false) {
      if (this.players[this.currentPlayer].hand.length < Rules.maxHandSize) {
        this.players[this.currentPlayer].drawCardFromDeck(this);
        this.deckCardDrawn = true;
        if (++this.cardDrawnCount == Rules.maxCardsDrawnPerTurn) {
          this.turnState = "finished";
        } else {
          this.turnState = "drawing";
        }
        //this.draw();
        return true;
      } else {
        alert("There is no room in your hand. Play some cards first");
      }
    } else {
      alert("You may only take one card from the face down pile, peasant.");
    }
  },

  drawCardFromPool: function(index, alert) {
    if (this.players[this.currentPlayer].hand.length < Rules.maxHandSize) {
      if (this.players[this.currentPlayer].drawCardFromPool(index, this)) {
        if (++this.cardDrawnCount == Rules.maxCardsDrawnPerTurn) {
          this.turnState = "finished";
        } else {
          this.turnState = "drawing";
        }
        return true;
      }
    } else {
      alert("There is no room in your hand. Play some cards first");
    }
  },

  //drawCardsFromPool: function(alert) {
  //  if (this.players[this.currentPlayer].hand.length < Rules.maxHandSize - 1) {
  //    this.players[this.currentPlayer].drawCardsFromPool(this);
  //    this.turnState = "finished";
  //    //this.draw();
  //    return true;
  //  } else {
  //    alert("There is no room in your hand. Play some cards first");
  //  }
  //},


  getObjectForClient: function() {
    return {
      board: this.board.getObjectForClient(),
      state: this.state,
      turnState: this.turnState,
      extractionRoute: this.getExtractionRouteForClient(),
      deck: this.deck.getObjectForClient(),
      deckX: this.deckX,
      deckY: this.deckY,
      handX: this.handX,
      handY: this.handY,
      stackX: this.stackX,
      stackY: this.stackY,
      players: this.getPlayersForClient(),

      currentPlayer: this.currentPlayer
    };
  },

  getPlayersForClient: function() {
    var out = [];
    for (var i = 0; i < this.players.length; i++) {
      out.push(this.players[i].getObjectForClient()); //TODO select here so that the full player data is only sent to each player?
    }
    return out;
  },

  getExtractionRouteForClient: function() {
    var out = [];
    for (var i = 0; i < this.extractionRoute.length; i++) {
      out.push(this.extractionRoute[i].getObjectForClient());
    }
    return out;
  }

};

module.exports = Game;
