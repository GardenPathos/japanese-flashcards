const _ = require('lodash');
const fs = require('fs');

// GLOBAL VOCAB FILE
const VOCAB_FILE = './data/japanese-vocabulary.txt';

/**
 * Read a tab-separated-values file and convert it to json.
 *
 * @param {string} filepath The path to the flashcards file
 * @return {object[]} An array of objects that have the file's header columns as keys
 */
function loadFlashcards() {
  console.log(`VOCAB_FILE: ${VOCAB_FILE}`);
  const flashcards = [];

  // read the file -- the data is small enough to keep in memory
  let vocabData;
  try {
    vocabData = fs.readFileSync(VOCAB_FILE, 'utf16le');
  } catch(err) {
    console.error(err);
    return err;
  }

  // split the tsv into lines and get the headers
  let lines = vocabData.split('\n');

  // something strange about the way the word 'english' is being decoded from the
  // file makes it unable to string match with 'english' in the API
  // const headers = _.head(lines).replace('\r', '').split('\t');
  const headers = ['english', 'kana', 'kanji'];
  lines = _.drop(lines);

  // create a flashcard object for each line
  _.forEach(lines, (line) => {
    const words = line.replace('\r', '').split('\t');
    const flashcard = {};
    _.forEach(words, (word, i) => {
      _.set(flashcard, headers[i], word || null);
    });

    // add the flashcard to the deck
    flashcards.push(flashcard);
  });

  // return the deck
  return _.shuffle(flashcards);
}

module.exports = {
  loadFlashcards,
}
