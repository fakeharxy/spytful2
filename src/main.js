$(document).ready(function(){
    var board = new Board(6, 6);
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);

    ctx.shadowColor= "rgba(100,100,100,.5)"
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 2;
    
    board.drawBoard(ctx);
});
