import Fastify from "fastify";
import formBody from "@fastify/formbody";
import { sendMail } from "./services/mailer.js";
import {
  welcomeMail,
  confirmationMail,
  campaignMail,
} from "./mailTemplates.js";

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

app.get("/verify/:email", async (request, reply) => {
  const { email } = request.params;
  try {
    const lead = await Lead.findOne({ where: { email } });
    if (lead) {
      lead.verified = true;
      await lead.save();
      console.log(`${email} is verified`);
      await sendMail(email, confirmationMail());
    }
  } catch (e) {
    console.log("Could not verify the Lead", e.message);
    reply.send({ message: "Unable to verify." });
  }
});

app.get(
  "/campaign/:campaignKey/user/:email/image.png",
  async (request, reply) => {
    const { email, campaignKey } = request.params;
    try {
      const lead = await Lead.findOne({ where: { email } });
      if (lead) {
        lead.lastCampaign = campaignKey;
        await lead.save();
        console.log(`${email} opened ${campaignKey}`);
      }
    } catch (e) {
      console.log("An error occurred", e.message);
    }
    reply.send({ message: "ok" });
  }
);
const port = process.env.PORT || 3000;

try {
  sendMail(
    "jon@jonwexler.com",
    campaignMail("Special Promotion", "promo1", "jon@jonwexler.com")
  );
  await app.listen({ port });
  console.log(`Server running at http://localhost:${port}`);
} catch (err) {
  console.error("Error starting server:", err);
  process.exit(1);
}
