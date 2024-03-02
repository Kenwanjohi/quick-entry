import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { randomUUID } from "node:crypto";

export default fp(async function authPlugin(fastify, opts) {
  // Configure JWT plugin
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET,
  });

  // Verify JWT token, will be called called on routes onRequest
  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.send(error);
    }
  });

  // Create JWT token
  fastify.decorateRequest("createToken", async function ({ expiresIn }) {
    const token = await fastify.jwt.sign(
      { userId: this.user.userId },
      {
        jti: randomUUID(),
        expiresIn,
      }
    );
    return token;
  });
});
