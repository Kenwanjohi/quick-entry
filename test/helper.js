// This file contains code that we reuse
// between our tests.

import helper from 'fastify-cli/helper.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const AppPath = path.join(__dirname, '..', 'app.js')

// Fill in this config with all the configurations
// needed for testing the application
function config (env) {
  return { ...env }
}

// automatically build and tear down our instance
async function build (t, env) {
  // you can set all the options supported by the fastify CLI command
  const argv = [AppPath]

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  const app = await helper.build(argv, config({ ...env }))

  // tear down our app after we are done
  t.after(() => app.close())

  return app
}

async function buildUser (app) {
  const username = randomBytes(16).toString('hex')
  const password = '12345678'
  const res = await app.inject({
    method: 'POST',
    url: 'accounts/register',
    payload: {
      username,
      password
    }
  })
  return {
    username,
    password,
    accessToken: res.json().accessToken
  }
}

export { config, build, buildUser }
