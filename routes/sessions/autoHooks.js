import fp from "fastify-plugin";

export default fp(
  async function sessionsAutoHooks(fastify, opts) {
    const users = fastify.mongo.db.collection("users");

    fastify.decorate("usersDataSource", {
      async getUser(username) {
        const user = await users.findOne({ username });
        return user;
      },
    });
  },
  { encapsulate: false }
);
