import { Sequelize, DataTypes } from "sequelize";
const db = new Sequelize({
  dialect: "sqlite",
  storage: "./journal.sqlite",
});
export const SentimentScore = db.define("SentimentScore", {
  score: DataTypes.DECIMAL,
});
await SentimentScore.sync();
