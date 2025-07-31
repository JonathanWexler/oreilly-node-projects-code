import bcrypt from "bcrypt";
const password = "test1234";
const hash = bcrypt.hashSync(password, 10);
console.log(`My hashed password is: ${hash}`);
