import SentimentJournal from "./sentimentJournal.js";

const journal = new SentimentJournal();
await journal.fetchEntries();

while (true) {
  await journal.printChart();
  await journal.promptEntry();
  await journal.analyzeSentiment();
}
