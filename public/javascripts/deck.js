var Deck = {
    cardArray : [],
    deckSizeMultiple : 3,

    buildDeck: function (hexArray) {
      this.cardArray=[];
      for (var j=0 ; j < hexArray.length ; j++) {
        for (var i=0 ; i < hexArray[j].length; i++) {
          for (var n=0 ; n < this.deckSizeMultiple ; n++) {
            var card = Object.create(Card);
            card.colourCode = hexArray[j][i].colourCode;
            card.regionName = hexArray[j][i].regionName;
            this.cardArray.push(card);
          }
        }
      }
    }
};

var Card = {
};
