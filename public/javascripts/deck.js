var Deck = {
    cardArray : [],
    deckSizeMultiple : 3,
    
    buildDeck: function (hexArray) {
        for (var i=0 ; i < hexArray.length ; i++) {
            for (j=0 ; j < deckSizeMultiple ; j++) {
                var card = Object.create(Card);
                card.colourCode = hexArray[i].colourCode;
                card.regionName = hexArray[i].regionName;
                cardArray.push(card);
            }
        }
    }
};

var Card = {
};
