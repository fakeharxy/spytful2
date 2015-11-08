describe("Hex", function() {

    it("hex should remember region colour 5", function() {
        var hex = Object.create(Hex);
        hex.colourCode = 5;
        expect(hex.colourCode).toBe(5);
    });

    it("hex should remember region name 'Andall'", function() {
        var hex = Object.create(Hex);
        hex.regionName = "Andall";
        expect(hex.regionName).toBe("Andall");
    });

});
