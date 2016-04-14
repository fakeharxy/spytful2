module.exports = {

  //turn limits
  maxOutpostsPerTurn: 1,
  maxCardsDrawnPerTurn: 2,
  
  //general limits
  boardWidth: 5,
  boardHeight: 5,
  maxCardsInPool: 3,  
  maxHandSize: 3,
  maxOutpostsPerPlayer: 3,
  
  //setup
  briefcasesPerPlayer: 4,
  cardsPerHex: 2,
  startCardsPool: 3,
  startCardsPlayer: 2,
  hexColours: 7,  //must not be less than 6 or greater than length of Hex.colourMap
  
  //scoring
  pointsPerHex: 0,
  minPointsPerBriefcase: 2,
  maxPointsPerBriefcase: 2, //don't forget to provide images for the briefcase values
  briefcaseBonusAccumulator: 0, //incrementor for bonus for every additional briefcase
  firstBriefcasePenalty: 1
}
