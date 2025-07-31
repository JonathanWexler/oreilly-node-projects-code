import bcrypt from "bcrypt";
import promptModule from "prompt-sync";
const prompt = promptModule();
const mockDB = { passwords: {} };

const saveNewPassword = (password) => {
  mockDB.hash = bcrypt.hashSync(password, 10);
  console.log("Password has been saved!");
  showMenu();
};

const compareHashedPassword = async (password) =>
  await bcrypt.compare(password, mockDB.hash);

const promptNewPassword = () => {
  const response = prompt("Enter a main password: ");
  saveNewPassword(response);
};

const promptOldPassword = async () => {
  let verified = false;
  while (!verified) {
    const response = prompt("Enter your password: ");
    const result = await compareHashedPassword(response);
    if (result) {
      console.log("Password verified.");
      verified = true;
      showMenu();
    } else {
      console.log("Password incorrect. Try again.");
    }
  }
};

const showMenu = async () => {
  console.log(`
    1. View passwords
    2. Manage new password
    3. Verify password
    4. Exit`);
  const response = prompt(">");
  if (response === "1") viewPasswords();
  else if (response === "2") promptManageNewPassword();
  else if (response === "3") promptOldPassword();
  else if (response === "4") process.exit();
  else {
    console.log(`That's an invalid response.`);
    showMenu();
  }
};

const viewPasswords = () => {
  const { passwords } = mockDB;
  Object.entries(passwords).forEach(([key, value], index) => {
    console.log(`${index + 1}. ${key} => ${value}`);
  });
  showMenu();
};

const promptManageNewPassword = () => {
  const source = prompt("Enter name for password: ");
  const password = prompt("Enter password to save: ");
  mockDB.passwords[source] = password;
  console.log(`Password for ${source} has been saved!`);
  showMenu();
};

if (!mockDB.hash) promptNewPassword();
else promptOldPassword();
