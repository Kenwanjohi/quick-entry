import fp from "fastify-plugin";

export default fp(
  async function accountsAutoHooks(fastify, opts) {
    const users = fastify.mongo.db.collection("users");

    fastify.decorate("usersDataSource", {
      async createUser(user) {
        const newUser = await users.insertOne(user);
        return newUser.insertedId;
      },

      async getUser(username) {
        const user = await users.findOne({ username });
        return user;
      },
    });
  },
  {
    encapsulate: true,
  }
);
