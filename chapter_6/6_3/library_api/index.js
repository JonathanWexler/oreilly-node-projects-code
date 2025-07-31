import Fastify from "fastify";
import formbody from "@fastify/formbody";

import routes from "./routes/index.js";

const app = Fastify();
const PORT = 3000;

await app.register(formbody);
app.register(routes, { prefix: "/api" });

app.get("/", async (_request, reply) => {
  reply.send({ message: "ok" });
});

app.setNotFoundHandler((request, reply) => {
  const { message, statusCode } = request.error || {};
  reply.status(statusCode || 500).send({ message });
});

try {
  await app.listen({ port: PORT });
  console.log(`Listening at http://localhost:${PORT}`);
} catch (err) {
  console.error(err);
  process.exit(1);
}
