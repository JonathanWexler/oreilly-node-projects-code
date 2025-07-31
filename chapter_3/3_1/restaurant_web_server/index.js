import Fastify from "fastify";

const app = Fastify();
const port = 3000;

app.get("/", async (request, reply) => {
  return "Welcome to What's Fare is Fair!";
});

app.get("/menu", async (request, reply) => {
  return "TODO: Menu Page";
});
app.get("/hours", async (request, reply) => {
  return "TODO: Hours Page";
});

await app.listen({ port });
console.log(`Web Server is listening at http://localhost:${port}`);
