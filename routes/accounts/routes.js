import fp from 'fastify-plugin'
import { hashPassword } from '../../utils.js'

export default fp(
  async function accounts (fastify, opts) {
    // Register new user
    fastify.post(
      '/register',
      {
        schema: {
          tags: ['Registration'],
          body: {
            title: 'New user',
            description: 'New user details',
            type: 'object',
            properties: {
              username: { description: 'username', type: 'string' },
              password: { description: 'password', type: 'string' }
            },
            required: ['username', 'password'],
            additionalProperties: false
          }
        }
      },
      async function registerHandler (request, reply) {
        const { password, username } = request.body
        const user = await this.usersDataSource.getUser(username)
        if (user) {
          const err = new Error('Already registered')
          err.statusCode = 409
          throw err
        }

        try {
          const hashedPassword = await hashPassword(password)
          const userId = await this.usersDataSource.createUser({
            ...request.body,
            password: hashedPassword
          })

          request.user = { userId, username }
          const accessToken = await request.createToken({ expiresIn: '30m' })
          reply.code(201)
          return { accessToken }
        } catch (err) {
          reply.code(500)
          return { registered: false }
        }
      }
    )
  },
  {
    encapsulate: true
  }
)
