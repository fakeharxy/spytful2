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
    expect(board.hexArray[0][0].colourCode).toEqual(deck.cardArray[0].colourCode);
  });

  it("a card in the same array location should be the same region as the hex in the hexArray", function() {
    expect(board.hexArray[0][0].regionName).toEqual(deck.cardArray[0].regionName);
  });


})
