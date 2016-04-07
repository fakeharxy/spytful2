 
// main.js is basically no longer needed


function endTurn() { //TODO move this to game
  if (game.turnState == 'finished') {
    game.checkIfGameEnd();
    if (game.state != 'finished') {
      game.nextTurn();
      draw();
    } else {
      game.determineWinner();
    }
  } else {
    alert("The game rules dictate you must draw cards before ending your turn...");
  }
}

//function onMouseMove(event) {
//  game.onmousemove(event.pageX - canvasX, event.pageY - canvasY);
//}

//function onMouseDown(event) {
//  game.onclick(event.pageX - canvasX, event.pageY - canvasY);
//}
