import prompt from "prompt";
import { createObjectCsvWriter } from "csv-writer";

const csvWriter = createObjectCsvWriter({
  path: "./contacts.csv",
  append: true,
  header: [
    { id: "name", title: "NAME" },
    { id: "number", title: "NUMBER" },
    { id: "email", title: "EMAIL" },
  ],
});

prompt.start();
prompt.message = "";

class Person {
  constructor(name = "", number = "", email = "") {
    this.name = name;
    this.number = number;
    this.email = email;
  }
  async saveToCSV() {
    try {
      const { name, number, email } = this;
      await csvWriter.writeRecords([{ name, number, email }]);
      console.log(`${name} Saved!`);
    } catch (err) {
      console.error(err);
    }
  }
}

const startApp = async () => {
  const questions = [
    { name: "name", description: "Contact Name" },
    { name: "number", description: "Contact Number" },
    { name: "email", description: "Contact Email" },
  ];
  const responses = await prompt.get(questions);
  const person = new Person(responses.name, responses.number, responses.email);
  await person.saveToCSV();
  const { again } = await prompt.get([
    { name: "again", description: "Continue? [y to continue]" },
  ]);
  if (again.toLowerCase() === "y") await startApp();
};

startApp();
