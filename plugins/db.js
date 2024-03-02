import fp from 'fastify-plugin'
import mongodb from '@fastify/mongodb'

export default fp(async function authPlugin (fastify, opts) {
  fastify.register(mongodb, {
    forceClose: true,
    url: process.env.MONGO_URI
  })
})
