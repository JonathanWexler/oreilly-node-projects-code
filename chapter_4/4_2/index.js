import Parser from "rss-parser";
const parser = new Parser();

const url = "https://www.bonappetit.com/feed/recipes-rss-feed/rss";
const { title, items } = await parser.parseURL(url);
console.log(title);
const results = items.map(({ title, link }) => ({ title, link }));
console.table(results);

// const main = async () => {
//   const url = "https://www.bonappetit.com/feed/recipes-rss-feed/rss";
//   const response = await fetch(url);
//   console.log(await response.text());
// };
// main();
