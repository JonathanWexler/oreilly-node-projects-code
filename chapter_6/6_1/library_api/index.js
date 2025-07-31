import Fastify from "fastify";
const app = Fastify();
const PORT = 3000;

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
