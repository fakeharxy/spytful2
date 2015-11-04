describe("Board", function() {

  var board;

  beforeEach(function() {
    board = Object.create(Board);
    board.buildBoard(3,3);
  });

  it("board should be created according to width and height", function() {
      expect(board.width).toBe(3);
  });

  it("#calculateHexCentreX should return the centre of any given hex", function() {
      expect(board.calculateHexCentreX(1,2)).toBe(110.6217782649107);
  });

  it("#calculateHexCentreY should return the centre of any given hex", function() {
      expect(board.calculateHexCentreY(1,2)).toBe(102.5);
  });

  it("board should return a Hex for a coordinate", function() {
      expect(Hex.isPrototypeOf(board.getHex(1,2))).toEqual(true);
  });

  it("board should return the same Hex for the same coordinate", function() {
      expect(board.getHex(1,2) === board.getHex(1,2)).toBe(true);
  });

});
