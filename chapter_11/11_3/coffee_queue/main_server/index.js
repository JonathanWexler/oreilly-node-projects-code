import Fastify from "fastify";
import amqp from "amqplib";

const app = Fastify();
const PORT = 3000;
let channel, connection;

async function connect() {
  try {
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();
    await channel.assertQueue("drink-order");
    console.log("Main app connected to RabbitMQ");
  } catch (err) {
    console.error("RabbitMQ connection failed:", err);
  }
}

await connect();

async function sendOrderData(data) {
  await channel.sendToQueue("drink-order", Buffer.from(JSON.stringify(data)), {
    persistent: true,
  });
}

app.post("/order", async (request, reply) => {
  const { drinkOrder: order, cost, customer } = request.body;
  const data = { order, customer };
  await sendOrderData(data);
  console.log(`Drink: ${order} is being processed for ${customer}`);
  reply.send("Order Processing");
});

// 👇 move this to the bottom, AFTER all routes are registered
await app.listen({ port: PORT });
console.log("Server running at http://localhost:" + PORT);
