import fp from "fastify-plugin";
import createEntry from "./createEntry.json" assert { type: "json" };
import fetchEntries from "./fetchEntries.json" assert { type: "json" };
import updateEntry from "./updateEntry.json" assert { type: "json" };
import deleteEntry from "./deleteEntry.json" assert { type: "json" };

export default fp(async function schemaPlugin(fastify, opts) {
  fastify.addSchema(createEntry);
  fastify.addSchema(fetchEntries);
  fastify.addSchema(updateEntry);
  fastify.addSchema(deleteEntry);
});
