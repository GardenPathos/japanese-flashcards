/**
 * javascript.js
 *
 * Handle the XMLHttpRequests and flashcard display.
 */


// global variable for the starter card
let CURRENT_CARD = {
  english: 'FRONT',
  showingFront: true,
  kana: 'BACK',
  front: 'english',
};

/**
 * Show the front of the flashcard
 */
function showFront() {
  // Just update the text with the current card's front word
  const innerText = `<p style="font-size:32px" align="center">${CURRENT_CARD[CURRENT_CARD.front]}</p>`;

  CURRENT_CARD.showingFront = true;
  document.getElementById('flashcard').innerHTML = innerText;
}

/**
 * Show the back of the flashcard
 */
function showBack() {
  // return all words that are not on the front of the card and that have a value for their key
  const backWords = ['english', 'kana', 'kanji']
    .map(k => k !== CURRENT_CARD.front && CURRENT_CARD[k])
    .filter(j => !!j);
  const innerText = `<p style="font-size:28px" align="center">${backWords.join('<br><br>')}</p>`;

  CURRENT_CARD.showingFront = false;
  document.getElementById('flashcard').innerHTML = innerText;

}

/**
 * Flip to the other side of the flashcard
 */
function flipFlashcard() {
  console.log(CURRENT_CARD);
  if (CURRENT_CARD.showingFront) return showBack();
  return showFront();
}

/**
 * get the value for the front parameter chosen from the radio buttons next to the flashcard
 */
function getFrontValue() {
  const englishRadio = document.getElementById('english');
  const kanaRadio = document.getElementById('kana');
  const kanjiRadio = document.getElementById('kanji');

  if (englishRadio.checked) return 'english';
  if (kanaRadio.checked) return 'kana';
  if (kanjiRadio.checked) return 'kanji';

  return 'random';
}

/**
 * Call GET /get API to select a flashcard to display
 */
function getFlashcard() {
  const frontValue = getFrontValue();
  const keepCardCheckbox = document.getElementById('keepCard');

  // build query string with parameters
  const queryString = `http://localhost:8089/get?front=${frontValue}&removeCard=${!keepCardCheckbox.checked}`;

  // send the request
  const xhr = new XMLHttpRequest();
  xhr.open('GET', queryString);
  xhr.send();

  xhr.onerror = function() {
    alert('Request failed');
  }

  xhr.onload = function() {
    if (xhr.status !== 200) {
      return alert(`Error ${xhr.status}: ${xhr.statusText}`);
    }

    const response = JSON.parse(xhr.response);

    if (response.success) return alert('No cards of the specified type remain in the deck. Click "Reset" to start over');

    CURRENT_CARD = response;
    CURRENT_CARD.showingFront = true;

    const innerText = `<p style="font-size:32px" align="center">${CURRENT_CARD[response.front]}</p>`
    document.getElementById('flashcard').innerHTML = innerText;
  }
}

/**
 * Call GET /reset API to select a flashcard to display
 */
function reset() {
  CURRENT_CARD = {
    english: 'FRONT',
    kana: 'BACK',
    showingFront: true,
  };

  // build query string with parameters
  const queryString = `http://localhost:8089/reset`;

  // send the request
  const xhr = new XMLHttpRequest();
  xhr.open('GET', queryString);
  xhr.send();

  xhr.onerror = function() {
    alert('Request failed');
  }

  xhr.onload = function() {
    if (xhr.status !== 200) {
      return alert(`Error ${xhr.status}: ${xhr.statusText}`);
    }

    const innerText = `<p style="font-size:32px" align="center">FRONT</p>`
    document.getElementById('flashcard').innerHTML = innerText;
  }
}
