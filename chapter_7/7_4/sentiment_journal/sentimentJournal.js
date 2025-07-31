import Sentiment from "sentiment";
import SpellChecker from "spellchecker";
import asciichart from "asciichart";

import { SentimentScore } from "./db.js";
import prompt from "prompt";
prompt.start();
prompt.message = "";

const chartConfig = {
  min: -1,
  max: 1,
  height: 10,
};

class SentimentJournal {
  constructor() {
    this.sentiment = new Sentiment();
    this.scores = [0];
    this.entry = "";
  }
  correctSpelling(inputString) {
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
  }

  async saveScore(score) {
    await SentimentScore.create({ score });
  }

  async fetchEntries() {
    const results = await SentimentScore.findAll({ limit: 100 });
    if (results.length) {
      this.scores = results.map(({ score }) => score);
    }
  }

  async analyzeSentiment() {
    if (!this.entry || this.entry === "") return;
    const { score } = this.sentiment.analyze(this.entry);
    const normalizedScore = Math.min(Math.max(score / 10, -1), 1);
    await this.saveScore(normalizedScore);
    this.scores.push(normalizedScore);
  }

  async promptEntry() {
    const { response } = await prompt.get([
      {
        name: "response",
        description: "How do you feel?",
      },
    ]);
    this.entry = this.correctSpelling(response);
  }

  setChartColor() {
    if (!this.scores.length) return;
    const recentScore = this.scores[this.scores.length - 1];
    if (recentScore < 0) {
      chartConfig.colors = [asciichart.red];
    } else {
      chartConfig.colors = [asciichart.green];
    }
  }

  printChart() {
    console.clear();
    this.setChartColor();
    console.log(asciichart.plot([this.scores], chartConfig));
  }
}
export default SentimentJournal;
