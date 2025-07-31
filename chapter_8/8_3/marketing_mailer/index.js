import Fastify from "fastify";
import formBody from "@fastify/formbody";
import { sendMail } from "./services/mailer.js";
import { welcomeMail } from "./mailTemplates.js";

import Lead from "./db.js";

const app = Fastify();
await app.register(formBody);

app.post("/subscribe", async (request, reply) => {
  const { email } = request.body;
  console.log(`Received ${email}`);
  try {
    await Lead.create({ email });
    await sendMail(email, welcomeMail());
  } catch (e) {
    console.log("Could not save the Lead", e.message);
  }
  reply.send({ message: "ok" });
});

const port = process.env.PORT || 3000;

try {
  await app.listen({ port });
  console.log(`Server running at http://localhost:${port}`);
} catch (err) {
  console.error("Error starting server:", err);
  process.exit(1);
}
