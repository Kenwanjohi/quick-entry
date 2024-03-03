import { test } from 'node:test'
import * as assert from 'node:assert'
import { build } from '../helper.js'
import { randomBytes } from 'node:crypto'

test('Account is created', async (t) => {
  const app = await build(t, {
    MONGO_URI: 'mongodb://localhost:27017/test-' + Date.now()
  })

  const res = await app.inject({
    method: 'POST',
    url: '/accounts/register',
    payload: {
      username: randomBytes(16).toString('hex'),
      password: '12345678'
    }
  })
  const { accessToken } = res.json()
  assert.match(accessToken, /(\w*\.){2}.*/)
})
