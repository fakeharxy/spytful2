describe("Player", function() {

  var player;
  var card;

  beforeEach(function() {
    player = Object.create(Player);
    player.setup();
    card = Object.create(Card);
    card.colourCode = 3;
    card.regionName = 'AB';
  });


  it("#createPlayer, should.", function() {
    expect(Player.isPrototypeOf(player)).toBe(true);
  });

  it("#player should remember a player's name", function() {
    player.name = 'Boris';
    expect(player.name).toBe('Boris');
  });

  it("#hand should remember a player's hand of cards", function() {
    player.hand.unshift(card);
    expect(player.hand[0].colourCode).toBe(3);
  });

  it("#stack should remember a player's movement stack", function() {
    player.stack.unshift(card);
    expect(player.stack[0].colourCode).toBe(3);
  });

  it("#stack should remember the cards in the movement stack", function() {
    for (var i = 0; i < 5; i++) {
      player.stack.unshift(card);
    }
    expect(player.stack.length).toBe(i);
  });

  it("should be able to move any card from the hand to the end of the stack", function() {
    var hex = Object.create(Hex);
    hex.colourCode = 1;
    hex.regionName = 'TY';
		
		var card2 = Object.create(Card);
		card2.hex = hex;
		
    player.hand.unshift(card2);
    player.hand.unshift(card);
    player.playCardToStack(1);
    expect(player.stack[0].hex.colourCode).toBe(1);
  });

  it("will set a colour for a new player when they are created", function() {
    expect(player.colour).not.toBe(undefined);
  });

  it("each player will be given a different colour", function() {
    var player2 = Object.create(Player);
    player2.setup();
    expect(player.colour).not.toBe(player2.colour);
  });
});
