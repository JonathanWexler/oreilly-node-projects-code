import puppeteer from "puppeteer";

const URL = "https://medium.com/tag/nodejs";

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.setUserAgent(
  "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118 Safari/537.36"
);
await page.goto(URL, { waitUntil: "networkidle2" });
(await page.waitForTimeout?.(3000)) ??
  (await new Promise((r) => setTimeout(r, 3000)));

const articles = await page.$$("article");
for (const el of articles) {
  const title = await el
    .$eval("h2", (el) => el.textContent.trim())
    .catch(() => null);
  const url = await el.$eval("a", (el) => el.href).catch(() => null);
  if (title && url) console.log(title, url);
}

await browser.close();
