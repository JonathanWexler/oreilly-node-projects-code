import Book from "../models/book.js";

async function booksRouter(fastify, _opts) {
  fastify.get("/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      const book = await Book.findByPk(id);
      reply.send(book);
    } catch (e) {
      console.error("Error occurred: ", e.message);
      reply.send(e);
    }
  });

  fastify.put("/:id", async (request, reply) => {
    const { id } = request.params;
    const { title, author } = request.body;
    try {
      const book = await Book.update(
        { title, author },
        {
          where: { id },
          returning: true,
        }
      );
      reply.send(book);
    } catch (e) {
      console.error("Error occurred: ", e.message);
      reply.send(e);
    }
  });

  fastify.delete("/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      const book = await Book.destroy({
        where: { id },
      });
      reply.send(book);
    } catch (e) {
      console.error("Error occurred: ", e.message);
      reply.send(e);
    }
  });

  fastify.post("/", async (request, reply) => {
    const { title, author } = request.body;

    try {
      const book = await Book.create({ title, author });
      reply.send(book);
    } catch (e) {
      console.error("Error occurred:", e.message);
      reply.send(e);
    }
  });
}

export default booksRouter;
