import { scheduleJob } from "node-schedule";
import { sendMail } from "./mailer.js";
import { campaignMail } from "../mailTemplates.js";

export const schedule = (timeOptions) => {
  scheduleJob(timeOptions, async () => {
    await sendMail(
      "jon@jonwexler.com",
      campaignMail("Special Promotion", "promo1", "jon@jonwexler.com")
    );
  });
};
