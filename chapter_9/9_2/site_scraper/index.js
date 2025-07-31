import { load } from "cheerio";

const URL = "https://medium.com/tag/nodejs";

try {
  const response = await fetch(URL);
  const text = await response.text();
  const $ = load(text);
  // const elements = $("article h2");
  // elements.each((_i, element) => {
  //   console.log($(element).text());
  // });

  const elements = $("article");
  elements.each((_i, element) => {
    const title = $(element).find("h2").text();
    const url = $(element).find("a").attr("href");
    console.log(title, url);
  });
} catch (e) {
  console.log("error", e.message);
}
