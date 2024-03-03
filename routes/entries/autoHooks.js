import fp from 'fastify-plugin'
import { ObjectId } from '@fastify/mongodb'
import schemas from './schemas/loader.js'
export default fp(
  async function entriesAutoHooks (fastify, opts) {
    const entries = fastify.mongo.db.collection('entries')

    fastify.register(schemas)

    fastify.decorate('entriesDataSource', {
      async createEntry (userId, entry) {
        const now = new Date()
        const { insertedId } = await entries.insertOne({
          userId: new ObjectId(userId),
          data: entry,
          createdAt: now,
          updatedAt: now
        })
        return insertedId
      },

      async readAllEntries (userId) {
        const entriesByUser = await entries
          .find({ userId: new ObjectId(userId) })
          .toArray()
        return entriesByUser
      },

      async updateEntry (id, userId, updatedEntry) {
        const now = new Date()
        const entry = await entries.findOne({
          _id: new ObjectId(id),
          userId: new ObjectId(userId)
        })
        Object.assign(entry, {
          data: { ...entry.data, ...updatedEntry },
          updatedAt: now
        })
        const updatedDocument = await entries.findOneAndUpdate(
          { _id: new ObjectId(id), userId: new ObjectId(userId) },
          {
            $set: {
              data: entry.data,
              updatedAt: now
            }
          },
          { returnNewDocument: true }
        )
        return updatedDocument
      },

      async deleteEntry (id, userId) {
        await entries.findOneAndDelete({
          _id: new ObjectId(id),
          userId: new ObjectId(userId)
        })
      }
    })
  },
  {
    encapsulate: true
  }
)
