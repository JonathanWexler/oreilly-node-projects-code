const URL = "https://medium.com/tag/nodejs";

try {
  const response = await fetch(URL);
  const text = await response.text();
  console.log(text);
} catch (e) {
  console.log("error", e.message);
}
