module.exports = {

  //turn limits
  maxOutpostsPerTurn: 1,
  maxCardsDrawnPerTurn: 2,
  
  //general limits
  boardWidth: 5,
  boardHeight: 5,
  maxCardsInPool: 3,  
  maxHandSize: 3,
  maxOutpostsPerPlayer: 2,
  extractOnBriefcase: false,
  crossStreams: false,
  
  //setup
  briefcasesPerPlayer: 3,
  cardsPerHex: 2,
  startCardsPool: 3,
  startCardsPlayer: 2,
  hexColours: 7,  //must not be less than 6 or greater than length of Hex.colourMap
  
  //scoring
  markBonus: 1,
  pointsPerHex: 0,
  minPointsPerBriefcase: 1,
  maxPointsPerBriefcase: 1, //don't forget to provide images for the briefcase values
  briefcaseBonusAccumulator: 0, //incrementor for bonus for every additional briefcase
  firstBriefcasePenalty: 0,
  briefcaseRespawn: true,
  briefcaseRespawnValue: 0 //briefcases will respawn where picked up with this change in value (until value is 0)
}
