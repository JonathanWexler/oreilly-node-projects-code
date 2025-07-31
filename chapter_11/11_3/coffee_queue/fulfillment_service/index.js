import Fastify from "fastify";
import amqp from "amqplib";

const app = Fastify();
const PORT = 3001;
let channel, connection;

await app.listen({ port: PORT });
console.log("Server running at http://localhost:" + PORT);

async function connect() {
  try {
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();
    await channel.assertQueue("drink-order");
    await channel.assertQueue("analytics");
  } catch (err) {
    console.error(err);
  }
}

await connect();

async function sendOrderData(data) {
  await channel.sendToQueue("analytics", Buffer.from(JSON.stringify(data)));
}

channel.consume("drink-order", async (data) => {
  const { content } = data;
  const { order, customer } = JSON.parse(content.toString());
  console.log(`${order} being fulfilled for ${customer}`);
  channel.ack(data);
  await sendOrderData({ order, customer });
});
