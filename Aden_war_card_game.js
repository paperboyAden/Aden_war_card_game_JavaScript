// basic card object
var Card = function (rank, suit) {
   this.rank = rank;
   this.suit = suit;
};

Card.prototype.string = function () {
  return this.rank + this.suit;
};

// convert face cards to numeric values
Card.prototype.getInt = function () {
  switch(this.rank) {
    case 'T':
      return 10;
    case 'J':
      return 11;
    case 'Q':
      return 12;
    case 'K':
      return 13;
    case 'A':
      return 14;
    default:
      return this.rank;
  }
};


// main game
var Game = function () {
  this.handA = [];
  this.handB = [];
  this.shuffleAndDeal();
};

Game.prototype.shuffleAndDeal = function () {
  var RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 'T', 'J', 'Q', 'K', 'A'],
  SUITS = ['s', 'c', 'd', 'h'],
  deck = [];

  _.forEach(RANKS, function (rank) {
    _.forEach(SUITS, function (suit) {
      deck.push(new Card(rank, suit));
    });
  });
  deck = _.shuffle(deck);
  for (var i = 0; i < deck.length; i++) {
    if (i % 2 === 0) {
      this.handA.push(deck[i]);
    } else {
      this.handB.push(deck[i]);
    }
  }
};

Game.prototype.compareCards = function (cardA, cardB) {
  if (cardA.getInt() > cardB.getInt()) {
    return 1;
  } else if (cardA.getInt() < cardB.getInt()) {
    return -1;
  } else {
    return 0;
  }
};


Game.prototype.handleWar = function (pot) {
  console.log("WAR");
  var cardA, cardB;
  // if a hand has less than 4 cards, grab the last card to bring about the end, add the rest to pot
  if (this.handA.length < 4) {
    cardA = this.handA.shift();
    pot = pot.concat(this.handA);
    this.handA = [];
  } else {
    // replace the first 3 cards into the pot
    for (var i = 0; i < 3; i++) {
      pot = pot.concat(this.handA.shift());
    }
    cardA = this.handA.shift();
  }

  if (this.handB.length < 4) {
    cardB = this.handB.shift();
    pot = pot.concat(this.handB);
    this.handB = [];
  } else {
    // replace the first 3 cards into the pot
    for (var j = 0; j < 3; j++) {
      pot = pot.concat(this.handB.shift());
    }
    cardB = this.handB.shift();
  }
  this.determineWinner(cardA, cardB, pot);
};

Game.prototype.printState = function(cardA, cardB, pot) {

  console.log("A Length " + this.handA.length);
  console.log("B Length " + this.handB.length);

  console.log("A " + cardA.string());
  console.log("B " + cardB.string());
  var str = "";
  for (var i = 0; i < pot.length; i++) {
    str += pot[i].string() + ", ";
  }
  console.log("pot " + str);

};

Game.prototype.determineWinner = function (cardA, cardB, pot) {
  if (!pot) {
    pot = [cardA, cardB];
  } else {
    pot = pot.concat([cardA, cardB]);
  }

  this.printState(cardA, cardB, pot);

  switch (this.compareCards(cardA, cardB)) {
    case 0:
      this.handleWar(pot);
      break;
    case 1:
      this.handA = this.handA.concat(pot);
      console.log("Hand A wins");
      break;
    case -1:
      this.handB = this.handB.concat(pot);
      console.log("Hand B wins");
      break;
  }
  if (this.handA.length === 0 || this.handB.length === 0) {
    return false;
  } else {
    return true;
  }
};

Game.prototype.mainLoop = function () {
  var cardA = this.handA.shift();
  var cardB = this.handB.shift();

  return this.determineWinner(cardA, cardB);
};

var gameInstance = new Game();
var lock = true;
while(lock) {
  lock = gameInstance.mainLoop();
}
console.log(gameInstance.handA);
console.log(gameInstance.handB);
