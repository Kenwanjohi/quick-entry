import { test } from 'node:test'
import * as assert from 'node:assert'
import { build, buildUser } from '../helper.js'
import { randomBytes } from 'node:crypto'

test.beforeEach(async (t) => {
  const app = await build(t, {
    MONGO_URI: 'mongodb://localhost:27017/test-' + Date.now()
  })
  const user = await buildUser(app)
  t.context = { user, app }
})

test('User login', async (t) => {
  const { app } = t.context
  const { username, password } = t.context.user

  const loginRes = await app.inject({
    url: 'sessions/login',
    method: 'POST',
    payload: {
      username,
      password
    }
  })

  assert.equal(loginRes.statusCode, 200)
  assert.ok(loginRes.json().accessToken)
})

test('User login with invalid credentials', async (t) => {
  const { app } = t.context

  const loginRes = await app.inject({
    url: 'sessions/login',
    method: 'POST',
    payload: {
      username: randomBytes(16).toString('hex'),
      password: randomBytes(8).toString('hex')
    }
  })

  assert.equal(loginRes.statusCode, 401)
  assert.equal(loginRes.json().authenticated, false)
  assert.equal(loginRes.json().message, 'Invalid credentials')
})

test('User login with missing credentials', async (t) => {
  const { app } = t.context

  const loginRes = await app.inject({
    url: 'sessions/login',
    method: 'POST',
    payload: {}
  })

  assert.equal(loginRes.statusCode, 400)
  assert.equal(loginRes.json().error, 'Bad Request')
})
