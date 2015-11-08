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

  it("#getHexAt should return a Hex for a valid coordinate", function() {
      expect(Hex.isPrototypeOf(board.getHexAt(1,2))).toBe(true);
  });

  it("#getHexAt should return undefined for an invalid coordinate", function() {
      expect(board.getHexAt(99,99)).toBe(undefined);
  });

  it("board should return the same Hex for the same coordinate", function() {
      expect(board.getHexAt(1,2) === board.getHexAt(1,2)).toBe(true);
  });

  it("#buildBoard should calculate all corner coordinates and store them in the Hexes", function() {
      expect(board.getHexAt(1,2).corners.length).toBe(6);
  });
  
});
