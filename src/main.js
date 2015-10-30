$(document).ready(function(){

    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var w = $("#canvas").width();
    var h = $("#canvas").height();
    var centre = {};
    centre.x = 50;
    centre.y = 50;
    var size = 30;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);

    drawHex(centre, size);

    function drawHex(centre, size) {
      var firstPoint = hex_corner(centre, size, 0);
      ctx.beginPath();
      ctx.moveTo(firstPoint.x, firstPoint.y);
      for (var i = 1; i <= 5; i++) {
        var nextPoint = hex_corner(centre, size, i);
        ctx.lineTo(nextPoint.x, nextPoint.y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    function hex_corner(centre, size, i) {
      var point = {};
      var angle_deg = 60 * i   + 30;
      var angle_rad = Math.PI / 180 * angle_deg;
      point.x = centre.x + size * Math.cos(angle_rad);
      point.y = centre.y + size * Math.sin(angle_rad);
      return point;

    }
});
