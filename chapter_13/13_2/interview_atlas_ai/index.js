import Fastify from "fastify";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const MODEL = "gemini-2.0-flash:generateContent";
const API_URL = `${BASE}/${MODEL}?key=${process.env.GEMINI_API_KEY}`;

const fastify = Fastify({ logger: true });
const PORT = process.env.PORT || 3000;

async function generateResponse(prompt) {
  try {
    const { data } = await axios.post(
      API_URL,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "You are an AI assistant that helps users " +
                  "learn programming and prepare for technical interviews. " +
                  "Provide clear explanations with examples when needed.",
              },
            ],
          },
          { role: "user", parts: [{ text: prompt }] },
        ],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received from AI."
    );
  } catch (error) {
    console.error(
      "Gemini API Request Failed:",
      error.response?.data || error.message
    );
    return {
      error: "Failed to fetch AI response",
      details: error.response?.data || error.message,
    };
  }
}

fastify.post("/query", async (request, reply) => {
  try {
    const { prompt } = request.body;
    if (!prompt) {
      return reply.status(400).send({ error: "Prompt is required" });
    }

    const response = await generateResponse(prompt);

    reply.send({ response });
  } catch (error) {
    console.error("Gemini API Error:", error);
    reply.status(500).send({
      error: "Error communicating with Gemini API",
      details: error.message,
    });
  }
});

const start = async () => {
  try {
    const address = await fastify.listen({ port: PORT });
    console.log(`Server running at ${address}`);
  } catch (err) {
    console.error("Server failed to start:", err);
    process.exit(1);
  }
};

start();
