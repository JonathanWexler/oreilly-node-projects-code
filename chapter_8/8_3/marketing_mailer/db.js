import { Sequelize } from "sequelize";

const db = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

try {
  await db.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const Lead = db.define(
  "Lead",
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    lastCampaign: {
      type: Sequelize.STRING,
    },
  },
  {}
);

Lead.sync();
export default Lead;
