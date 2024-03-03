import fp from 'fastify-plugin'
import bcrypt from 'bcrypt'

export default fp(
  async function sessions (fastify, opts) {
    fastify.post(
      '/login',
      {
        schema: {
          tags: ['Authentication'],
          body: {
            title: 'User Login',
            description: 'User login details',
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
      async function loginHandler (request, reply) {
        try {
          const { username, password } = request.body
          const user = await this.usersDataSource.getUser(username)
          if (!user) {
            reply.code(401)
            return { authenticated: false, message: 'Invalid credentials' }
          }

          const passwordMatch = await bcrypt.compare(password, user.password)
          if (!passwordMatch) {
            reply.code(401)
            return { authenticated: false, message: 'Invalid credentials' }
          }
          request.user = { userId: user._id, username }
          const accessToken = await request.createToken({ expiresIn: '30m' })

          reply.code(200)
          return { accessToken }
        } catch (error) {
          reply.code(500)
          return { authenticated: false, message: 'Internal server error' }
        }
      }
    )
  },
  {
    encapsulate: true
  }
)
