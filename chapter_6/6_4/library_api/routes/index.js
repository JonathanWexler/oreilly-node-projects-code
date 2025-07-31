import booksRouter from "./booksRouter.js";

async function routes(fastify, _opts) {
  fastify.register(booksRouter, { prefix: "/books" });
}

export default routes;
