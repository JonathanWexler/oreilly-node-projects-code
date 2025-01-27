import bcrypt from "bcrypt";
import promptModule from "prompt-sync";
import { MongoClient } from "mongodb";

const prompt = promptModule();

const dbUrl = "mongodb://localhost:27017";
const client = new MongoClient(dbUrl);
let passwordsCollection,
  authCollection,
  hasPasswords = false,
  dbName = "passwordManager";

const main = async () => {
  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    authCollection = db.collection("auth");
    passwordsCollection = db.collection("passwords");
    const hashedPassword = await authCollection.findOne({ type: "auth" });
    hasPasswords = !!hashedPassword;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

const saveNewPassword = async (password) => {
  const hash = bcrypt.hashSync(password, 10);
  await authCollection.insertOne({ type: "auth", hash });
  console.log("Password has been saved!");
  showMenu();
};

const compareHashedPassword = async (password) => {
  const { hash } = await authCollection.findOne({ type: "auth" });
  return bcrypt.compare(password, hash);
};

const promptNewPassword = () => {
  const response = prompt("Enter a main password: ");
  saveNewPassword(response);
};

const promptOldPassword = async () => {
  const response = prompt("Enter your password: ");
  const result = await compareHashedPassword(response);
  if (result) {
    console.log("Password verified.");
    showMenu();
  } else {
    console.log("Password incorrect.");
    promptOldPassword();
  }
};

const viewPasswords = async () => {
  const passwords = await passwordsCollection.find({}).toArray();
  passwords.forEach(({ source, password }, index) => {
    console.log(`${index + 1}. ${source} => ${password}`);
  });
  showMenu();
};

const showMenu = async () => {
  console.log(`
    1. View passwords
    2. Manage new password
    3. Verify password
    4. Exit`);
  const response = prompt(">");

  switch (response) {
    case "1":
      await viewPasswords();
      break;
    case "2":
      await promptManageNewPassword();
      break;
    case "3":
      await promptOldPassword();
      break;
    case "4":
      process.exit();
    default:
      console.log("That's an invalid response.");
      showMenu();
  }
};

const promptManageNewPassword = async () => {
  const source = prompt("Enter name for password: ");
  const password = prompt("Enter password to save: ");
  await passwordsCollection.findOneAndUpdate(
    { source },
    { $set: { password } },
    { upsert: true }
  );
  console.log(`Password for ${source} has been saved!`);
  showMenu();
};

await main();
console.log("Connected to the database");
if (!hasPasswords) promptNewPassword();
else promptOldPassword();
