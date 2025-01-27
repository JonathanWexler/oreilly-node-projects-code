/**
 * First version is to simply write to a file
 */

import { writeFileSync } from "fs";

const content = "Test content!";

try {
  writeFileSync("./test.txt", content);
  console.log("Success!");
} catch (err) {
  console.error(err);
}
