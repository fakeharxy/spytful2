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

});

describe("Hex creation", function() {
    
    it("#setValidColour, should.", function() {
        var hex = Object.create(Hex);
        hex.setValidColour();
        expect(hex.colourCode).not.toBe('undefined');
    });
});
