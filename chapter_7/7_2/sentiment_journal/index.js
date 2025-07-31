import SpellChecker from "spellchecker";
import natural from "natural";
import { removeStopwords } from "stopword";

const tokenizer = new natural.WordTokenizer();

const inputString = "I am feling grat!";

const correctSpelling = (inputString) => {
  const words = inputString.split(" ");
  const corrections = [];
  for (let word of words) {
    if (SpellChecker.isMisspelled(word)) {
      const options = SpellChecker.getCorrectionsForMisspelling(word);
      corrections.push(options[0]);
    } else {
      corrections.push(word);
    }
  }
  return corrections.join(" ");
};

const tokenizeInput = (inputString) => {
  return tokenizer.tokenize(inputString);
};

const stemWords = (tokens) => {
  const stems = [];
  for (let token of tokens) {
    const stem = natural.PorterStemmer.stem(token);
    stems.push(stem);
  }
  return stems;
};

const correctedSpelling = correctSpelling(inputString);
const tokens = tokenizeInput(correctedSpelling);
const stems = stemWords(tokens);
const removedStopWords = removeStopwords(stems);
console.log(removedStopWords);
