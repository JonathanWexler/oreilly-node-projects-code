import SpellChecker from "spellchecker";
import natural from "natural";
import prompt from "prompt";
prompt.start({});
prompt.message = "";

const tokenizer = new natural.WordTokenizer();

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

(async () => {
  try {
    const { inputString } = await prompt.get([
      {
        name: "inputString",
        description: "How do you feel?",
      },
    ]);
    const correctedSpelling = correctSpelling(inputString);
    const tokens = tokenizeInput(correctedSpelling);
    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");
    const sentimentResults = analyzer.getSentiment(tokens);
    console.log(sentimentResults);
  } catch (e) {
    console.log(`An error occurred: ${e.message}`);
  }
})();
