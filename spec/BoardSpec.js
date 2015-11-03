describe("Board", function() {
    
    it("board should be created according to width and height", function() {
        board = new Board(3,3);
        expect(board.width).toBe(3);
    });

    it("#calculateHexCentreX should return the centre of any given hex", function() {
        board = new Board(3,3);
        expect(board.calculateHexCentreX(1,2)).toBe(110.6217782649107);
    });

    it("#calculateHexCentreY should return the centre of any given hex", function() {
        board = new Board(3,3);
        expect(board.calculateHexCentreY(1,2)).toBe(102.5);
    });

});
