import fp from 'fastify-plugin'
export default fp(
  async function (fastify, opts) {
    fastify.get('/', async function (request, reply) {
      return { root: true }
    })
  },
  { encapsulate: true }
)
