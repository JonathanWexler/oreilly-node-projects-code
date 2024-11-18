import Fastify from "fastify";
const app = Fastify();
const port = 3000;

app.get("/", async (request, reply) => {
  return "Welcome to What's Fare is Fair!";
});

app.listen({ port }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Web Server is listening at http://localhost:${port}`);
});
