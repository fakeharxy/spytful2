describe("Deck", function() {

  var board, deck;

  beforeEach(function(){
    board = Object.create(Board);
    board.buildBoard(3,3);
    deck = Object.create(Deck);
    deck.buildDeck(board.hexArray);
  });


  it("should be filled with the correct number of cards for the board", function() {
		var hexCount = board.width * board.height;
		for (var j=0; j<board.height; j++) {
			for (var i=0; i<board.width; i++) {
				if (board.hexArray[j][i].colourCode==0) {
					hexCount--;
				}
			}
	  }
    expect(deck.cardArray.length).toBe(deck.deckSizeMultiple * hexCount);
  });

  it("a card in the same array location should be the same colour as the hex in the hexArray", function() {
	var j=-1, i, notFound = true;
	while (notFound && ++j<board.height) {
		i=-1;
		while (notFound && ++i<board.width) {
			if (board.hexArray[j][i].colourCode!=0) {
				notFound = false;
			}
		}
	}
    expect(board.hexArray[j][i].colourCode).toEqual(deck.cardArray[0].colourCode);
  });

  it("a card in the same array location should be the same region as the hex in the hexArray", function() {
	var j=-1, i, notFound = true;
	while (notFound && ++j<board.height) {
		i=-1;
		while(notFound && ++i<board.width) {
			if (board.hexArray[j][i].colourCode!=0) {
				notFound = false;
			}
		}
	}
	expect(board.hexArray[j][i].regionName).toEqual(deck.cardArray[0].regionName);
  });

  it("After setup, the cardPool should have two cards", function(){
      deck.deal(deck.cardPool, 2);
      expect(deck.cardPool.length).toEqual(2);
  });
  it("After setup, the cardPool should contain cards", function(){
      deck.deal(deck.cardPool, 2);
      expect(Card.isPrototypeOf(deck.cardPool[0])).toEqual(true);
  });
})
