import Fastify from "fastify";
import operatingHours from "./data/operatingHours.js";
import menuItems from "./data/menuItems.js";

const app = Fastify();
const port = 3000;

app.get("/", async (request, reply) => {
  return "Welcome to What's Fare is Fair!";
});

app.get("/menu", async (request, reply) => {
  reply.send(menuItems);
});

app.get("/hours", async (request, reply) => {
  reply.send(operatingHours);
});

app.listen({ port }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Web Server is listening at ${address}`);
});
