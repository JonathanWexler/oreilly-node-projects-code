import Parser from "rss-parser";
const parser = new Parser();

const url = "https://www.bonappetit.com/feed/recipes-rss-feed/rss";

const main = async () => {
  const { title, items } = await parser.parseURL(url);

  console.clear(); // Clear console before each update
  console.log(title); // Print feed title

  const results = items.map(({ title, link }) => ({ title, link }));
  console.table(results); // Show as formatted table

  console.log("Last updated:", new Date().toUTCString()); // Show timestamp
};

setInterval(main, 2000); // Fetch every 2 seconds
