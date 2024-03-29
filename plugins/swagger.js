import fp from 'fastify-plugin'
import Swagger from '@fastify/swagger'
import SwaggerUI from '@fastify/swagger-ui'

export default fp(async function swaggerPlugin (fastify, opts) {
  const baseURL =
    process.env.NODE_ENV === 'production'
      ? 'https://quick-entry.fly.dev/'
      : 'http://127.0.0.1:3000/'

  fastify.register(Swagger, {
    openapi: {
      info: {
        title: 'Quick Entries API Documentation',
        description: 'An API for managing user dynamic data entries',
        version: '1.0.0'
      },
      servers: [
        {
          url: baseURL
        }
      ],
      tags: [
        {
          name: 'Registration',
          description: 'Endpoints related to user registration.'
        },
        {
          name: 'Authentication',
          description: 'Endpoints related to user authentication.'
        },
        {
          name: 'Entries',
          description: 'Endpoints related to managing user data entries.'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ]
    }
  })
  fastify.register(SwaggerUI, {
    routePrefix: '/documentation'
  })
})
