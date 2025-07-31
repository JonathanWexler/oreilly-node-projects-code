const main = async () => {
  const url = "https://www.bonappetit.com/feed/recipes-rss-feed/rss";
  const response = await fetch(url);
  console.log(await response.text());
};
main();
