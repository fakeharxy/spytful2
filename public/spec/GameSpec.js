describe("Game", function() {

  var game;
  var boardWidth;
  var boardHeight;

  beforeEach(function() {
    game = Object.create(Game);
    boardWidth = 5 + Math.floor(Math.random() * 10);
    boardHeight = 5 + Math.floor(Math.random() * 10);
    game.setup(boardWidth, boardHeight);
  });

  it("should have a correctly sized board after setup", function() {
    expect(game.board.width == boardWidth && game.board.height == boardHeight).toBe(true);
  });

  it("should have a correctly sized deck after setup", function() {
    //account for water
    var hexCount = game.board.width * game.board.height;
    for (var j = 0; j < game.board.height; j++) {
      for (var i = 0; i < game.board.width; i++) {
        if (game.board.hexArray[j][i].colourCode == 0) {
          hexCount--;
        }
      }
    }
    expect(game.deck.cardArray.length).toEqual(game.deck.deckSizeMultiple * hexCount);
  });

  it("should have an empty players array after setup", function() {
    expect(game.players.length).toEqual(0);
  });

  it("should have the correct number of players after adding players", function() {
    var playerCount = 2 + Math.floor(Math.random() * 3);
    for (var i = 0; i < playerCount; i++) {
      game.addPlayer("player " + i);
    }
    expect(game.players.length).toEqual(playerCount);
  });

  it("should add the correct number of briefcases per player after preparing the game to start",
    function() {
      var playerCount = 2 + Math.floor(Math.random() * 3);
      for (var i = 0; i < playerCount; i++) {
        game.addPlayer("player " + i);
      }
      game.prepareGame();

      var briefcaseCount = 0;
      for (var j = 0; j < game.board.height; j++) {
        for (var i = 0; i < game.board.width; i++) {
          if (game.board.hexArray[j][i].hasBriefcase) {
            briefcaseCount++;
          }
        }
      }
      expect(briefcaseCount).toEqual(playerCount * Game.briefcasesPerPlayer);
    });

  it("should give all players 2 cards after preparing the game to start", function() {
    var playerCount = 2 + Math.floor(Math.random() * 3);
    for (var i = 0; i < playerCount; i++) {
      game.addPlayer("player " + i);
    }
    game.prepareGame();
    expect(game.players[Math.floor(Math.random() * playerCount)].hand.length).toBe(2);
  });
});
