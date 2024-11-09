import Fastify from "fastify";
import operatingHours from "./data/operatingHours.js";
import menuItems from "./data/menuItems.js";
import ejs from "ejs";
import fastifyView from "@fastify/view";

const app = Fastify();

app.register(fastifyView, {
  engine: {
    ejs: ejs,
  },
});

app.get("/", (req, reply) => {
  reply.view("views/index.ejs", { name: "What's Fare is Fair" });
});

app.get("/menu", (req, reply) => {
  reply.view("views/menu.ejs", { menuItems });
});

app.get("/hours", (req, reply) => {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  reply.view("views/hours.ejs", { operatingHours, days });
});

app.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Server running at ${address}`);
});
