/**
 * Flascards routes
 */
const _ = require('lodash');
const errors = require('restify-errors');

const { loadFlashcards } = require('../helpers/flashcard-loader.js');

const ALLOWED_HEADERS = ['english', 'kana', 'kanji', 'random'];
let DECK = loadFlashcards();

/**
 * Reset the deck to include all cards from the vocabulary file.
 */
function reset(req, res, next) {
  // Reload the deck
  DECK = loadFlashcards();

  // Make sure it loaded correctly
  if (_.isError(DECK)) {
    return next(new errors.InternalServerError(`ERROR: Unable to read data from vocab file: ${DECK}`));
  }

  // Send a success response
  res.send({ success: true });
  return next();
}

/**
 * Pick a flashcard from the deck.
 */
function get(req, res, next) {
  // Check for the 'front' param
  let { front, removeCard } = req.query;
  console.log(req.query);

  // If it exists, it must be one of the following: ['english', 'hiragana', 'kanji']
  if (front && !_.includes(ALLOWED_HEADERS, front)) {
    return next(new errors.InvalidContentError(`ERROR: value for parameter "front" must be one of ${ALLOWED_HEADERS}`));
  }

  // If a "front" parameter was not sent in the query string, assign one of the allowed headers to "front" at random
  console.log(front);
  if (front === 'random') front = _.sample(_.without(ALLOWED_HEADERS, 'random'));

  // Only choose a card with the "front" param actually populated. If the user specifies "kanji",
  // we can't give them a card with { kanji: null }.
  const filteredDeck = _.filter(DECK, front);

  // Make sure there are still cards in the deck
  if (!filteredDeck.length) {
    res.send({ emptyDeck: true });
    return next();
  }

  // Pick a card from the filtered deck at random. Remove it.
  const card = _.sample(filteredDeck);

  if (removeCard) {
    _.remove(DECK, c => c[front] === card[front]);
  }

  // Let the front end know which term to put on the front of the flashcard.
  card.front = front;

  console.log(card);
  res.send(card);
  return next();
}

module.exports = {
  get,
  reset,
};
