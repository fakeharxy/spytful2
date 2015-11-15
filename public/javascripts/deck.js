var Deck = {
    cardArray : [],
    deckSizeMultiple : 3,
    cardWidth: 60,
    cardHeight: 100,
    cardRoundingRadius: 10,
    cardSpacing: 20,
    cardRotationMax: 0.08,
    cardWobbleMax: 8,
    drawPoints: [],

    deal: function (dealLocation, dealNumber){
        Array.prototype.push.apply(dealLocation, this.cardArray.splice(0, dealNumber));
    },

    buildDeck: function (hexArray) {
        this.cardPool=[];
        this.cardArray=[];
        var points = [ [0,0], [Deck.cardWidth,0], [Deck.cardWidth,Deck.cardHeight], [0,Deck.cardHeight] ];
        drawPoints = Board.getRoundedPoints(points, Deck.cardRoundingRadius);

        for (var j=0 ; j < hexArray.length ; j++) {
            for (var i=0 ; i < hexArray[j].length; i++) {
                for (var n=0 ; n < this.deckSizeMultiple ; n++) {
                    if (hexArray[j][i].colourCode!=0) {
                        var card = Object.create(Card);
                        card.colourCode = hexArray[j][i].colourCode;
                        card.regionName = hexArray[j][i].regionName;
                        card.rotation = Math.random() * Deck.cardRotationMax - Deck.cardRotationMax / 2;
                        var wobble = {};
                        wobble.x = Math.random() * Deck.cardWobbleMax - Deck.cardWobbleMax / 2;
                        wobble.y = Math.random() * Deck.cardWobbleMax - Deck.cardWobbleMax / 2;
                        card.wobble = wobble;
                        this.cardArray.push(card);
                    }
                }
            }
        }
    },

    shuffle: function(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    },

    draw: function (ctx, x, y) {
        //draw card pool
        if (this.cardPool.length>0) {
            this.cardPool[0].draw(ctx, x, y, true);
            if (this.cardPool.length>1) {
                this.cardPool[1].draw(ctx, x + Deck.cardWidth + Deck.cardSpacing, y, true);
            }
        }

        //draw deck
        var xHeap = x + 2*(Deck.cardWidth + Deck.cardSpacing);
        for (var i=this.cardArray.length-1;i>=0;i--) {
            this.cardArray[i].draw(ctx, xHeap, y, false);
        }
    }
};

var Card = {

    draw: function (ctx, x, y, faceUp) {
        ctx.save();

        ctx.translate(x + this.wobble.x, y + this.wobble.y);
        ctx.rotate(this.rotation);
        ctx.shadowColor = "transparent";

        ctx.beginPath();
        for (var i = 0; i < drawPoints.length; i++) {
            var pt = drawPoints[i];
            if (i == 0) {
                ctx.moveTo(pt[0], pt[1]);
            } else {
                ctx.lineTo(pt[0], pt[1]);
            }
            ctx.quadraticCurveTo(pt[2], pt[3], pt[4], pt[5]);
        }
        ctx.closePath();

        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = faceUp ? Hex.colourMap[this.colourCode] : "#FFF";
        ctx.fill();

        //write region name
        //if (faceUp) {
        ctx.fillStyle = "#000"
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(faceUp ? this.regionName : "LOGO", Deck.cardWidth/2, Deck.cardHeight/2);
        //}
        ctx.restore();
    }
};
