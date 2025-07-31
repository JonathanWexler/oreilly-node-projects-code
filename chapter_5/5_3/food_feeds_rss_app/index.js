import Parser from "rss-parser";
const parser = new Parser();

const urls = [
  "https://www.bonappetit.com/feed/recipes-rss-feed/rss",
  "https://www.budgetbytes.com/category/recipes/feed/",
  "https://www.reddit.com/r/recipes/.rss",
];

const main = async () => {
  const feedItems = [];
  const awaitableRequests = urls.map((url) => parser.parseURL(url));
  const responses = await Promise.all(awaitableRequests);
  aggregate(responses, feedItems);
  print(feedItems);
};

const aggregate = (responses, feedItems) => {
  for (let { items } of responses) {
    for (let { title, link } of items) {
      if (title.toLowerCase().includes("veg")) {
        feedItems.push({ title, link });
      }
    }
  }
  return feedItems;
};

const print = (feedItems) => {
  console.clear();
  console.table(feedItems);
  console.log("Last updated ", new Date().toUTCString());
};

setInterval(main, 2000);
