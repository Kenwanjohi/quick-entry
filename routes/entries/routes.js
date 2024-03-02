import fp from 'fastify-plugin'

export default fp(
  async function entries (fastify, opts) {
    fastify.post(
      '/',
      { onRequest: [fastify.authenticate] },
      async function createEntryHandler (request, reply) {
        const { userId } = request.user
        const entry = request.body
        try {
          await fastify.entriesDataSource.createEntry(userId, entry)
          reply.code(201).send()
        } catch (error) {
          reply.code(500)
          return { error: 'Failed to create' }
        }
      }
    )

    fastify.get(
      '/',
      { onRequest: [fastify.authenticate] },
      async function fetchEntriesHandler (request, reply) {
        const { userId } = request.user
        try {
          const entries = await fastify.entriesDataSource.readAllEntries(
            userId
          )
          return entries
        } catch (error) {
          reply.code(500)
          return { error: 'Failed to fetch entries' }
        }
      }
    )

    fastify.patch(
      '/:id',
      { onRequest: [fastify.authenticate] },
      async function updateEntryHandler (request, reply) {
        const { userId } = request.user
        const entryId = request.params.id
        const updatedEntry = request.body
        try {
          const result = await fastify.entriesDataSource.updateEntry(
            entryId,
            userId,
            updatedEntry
          )
          if (!result) {
            reply.code(404)
            return { error: 'Entry not found' }
          }
          return result
        } catch (error) {
          reply.code(500)
          return { error: 'Failed to update entry' }
        }
      }
    )

    fastify.delete(
      '/:id',
      { onRequest: [fastify.authenticate] },
      async function deleteHandler (request, reply) {
        const { userId } = request.user
        const entryId = request.params.id
        try {
          await fastify.entriesDataSource.deleteEntry(entryId, userId)
          reply.code(204).send()
        } catch (error) {
          reply.code(500)
          return { error: 'Failed to delete entry' }
        }
      }
    )
  },
  {
    encapsulate: true
  }
)
