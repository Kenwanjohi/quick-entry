import fp from "fastify-plugin";

export default fp(
  async function entries(fastify, opts) {
    fastify.post(
      "/",
      {
        onRequest: [fastify.authenticate],
        schema: fastify.getSchema("schema:entry:create"),
      },
      async function createEntryHandler(request, reply) {
        const { userId } = request.user;
        const entry = request.body;
        try {
          const id = await fastify.entriesDataSource.createEntry(userId, entry);
          reply.code(201);
          return { id };
        } catch (error) {
          reply.code(500);
          return { error: "Failed to create" };
        }
      }
    );

    fastify.get(
      "/",
      {
        onRequest: [fastify.authenticate],
        schema: fastify.getSchema("schema:entry:fetch"),
      },
      async function fetchEntriesHandler(request, reply) {
        const { userId } = request.user;
        try {
          const entries = await fastify.entriesDataSource.readAllEntries(
            userId
          );
          return entries;
        } catch (error) {
          reply.code(500);
          return { error: "Failed to fetch entries" };
        }
      }
    );

    fastify.patch(
      "/:id",
      {
        onRequest: [fastify.authenticate],
        schema: fastify.getSchema("schema:entry:update"),
      },
      async function updateEntryHandler(request, reply) {
        const { userId } = request.user;
        const entryId = request.params.id;
        const updatedEntry = request.body;
        try {
          const result = await fastify.entriesDataSource.updateEntry(
            entryId,
            userId,
            updatedEntry
          );
          if (!result) {
            reply.code(404);
            return { error: "Entry not found" };
          }
          reply.code(204).send();
        } catch (error) {
          reply.code(500);
          return { error: "Failed to update entry" };
        }
      }
    );

    fastify.delete(
      "/:id",
      {
        onRequest: [fastify.authenticate],
        schema: fastify.getSchema("schema:entry:delete"),
      },
      async function deleteHandler(request, reply) {
        const { userId } = request.user;
        const entryId = request.params.id;
        try {
          await fastify.entriesDataSource.deleteEntry(entryId, userId);
          reply.code(204).send();
        } catch (error) {
          reply.code(500);
          return { error: "Failed to delete entry" };
        }
      }
    );
  },
  {
    encapsulate: true,
  }
);
