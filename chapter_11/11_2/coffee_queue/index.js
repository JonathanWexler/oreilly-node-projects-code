import Fastify from "fastify";
import amqp from "amqplib";

const app = Fastify();
const PORT = 3000;
let channel, connection;

await app.listen({ port: PORT });
console.log("Server running at http://localhost:" + PORT);

async function connect() {
  try {
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();
    await channel.assertQueue("drink-order");
  } catch (err) {
    console.error(err);
  }
}

await connect();

async function sendOrderData(data) {
  await channel.sendToQueue("drink-order", Buffer.from(JSON.stringify(data)));
}

app.post("/order", async (request, reply) => {
  const { drinkOrder: order, cost, customer } = request.body;
  const data = { order, customer };
  await sendOrderData(data);
  console.log(`Drink: ${order} is being processed for ${customer}`);
  reply.send("Order Processing");
});
