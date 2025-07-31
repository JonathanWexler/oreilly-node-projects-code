import { Sequelize } from "sequelize";

const db = new Sequelize({
  dialect: "sqlite",
  storage: "./db/database.sqlite",
});

try {
  await db.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

export default {
  Sequelize,
  db,
};
