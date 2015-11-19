describe("Player", function() {

    var player;

    beforeEach(function(){
        player = Object.create(Player);
        player.setupHand();
    });


    it("#createPlayer, should.", function(){
        expect(Player.isPrototypeOf(player)).toBe(true);
    });

    it("#player should remember a player's name", function(){
        player.name = 'Boris';
        expect(player.name).toBe('Boris');
    });

    it("#hand should remember a player's hand of cards", function(){
        var card = Object.create(Card);
        card.colourCode = 3;
        card.regionName = 'AB';
        player.hand.unshift(card);
        expect(player.hand[0].colourCode).toBe(3);
    });

});
