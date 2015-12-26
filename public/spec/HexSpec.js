describe("Hex", function() {
    var hex;
    beforeEach(function(){
        hex = Object.create(Hex);
        hex.colourCode = 5;
        hex.regionName = 'Andall';
    });

    it("hex should remember region colour 5", function() {
        expect(hex.colourCode).toBe(5);
    });

    it("hex should remember region name 'Andall'", function() {
        expect(hex.regionName).toBe("Andall");
    });

    it("#setValidColour, should.", function() {
				var hexNeighbour = Object.create(Hex);
				hexNeighbour.neighbours = [ hex ];
        hexNeighbour.setValidColour();
        expect(hexNeighbour.colourCode).not.toBe('undefined');
    });
});
