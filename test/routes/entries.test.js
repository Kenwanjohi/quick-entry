import { test } from 'node:test'
import * as assert from 'node:assert'
import { build, buildUser } from '../helper.js'

test.beforeEach(async (t) => {
  const app = await build(t, {
    MONGO_URI: 'mongodb://localhost:27017/test-' + Date.now()
  })
  const user = await buildUser(app)
  t.context = { user, app }
})

test('Add entry', async (t) => {
  const { app } = t.context
  const { accessToken } = t.context.user

  const res = await app.inject({
    url: '/entries',
    method: 'POST',
    payload: {
      example: 'data'
    },
    ...headers(accessToken)
  })
  assert.equal(res.statusCode, 201)
})

test('Fetch entries', async (t) => {
  const { app } = t.context
  const { accessToken } = t.context.user

  // Add some entries before fetching
  await app.inject({
    url: '/entries',
    method: 'POST',
    payload: {
      example: 'data1'
    },
    ...headers(accessToken)
  })

  await app.inject({
    url: '/entries',
    method: 'POST',
    payload: {
      example: 'data2'
    },
    ...headers(accessToken)
  })

  // Fetch entries to confirm
  const res = await app.inject({
    url: '/entries',
    method: 'GET',
    ...headers(accessToken)
  })

  assert.equal(res.statusCode, 200)
  assert.equal(res.json().length, 2)
})

test('Update entry', async (t) => {
  const { app } = t.context
  const { accessToken } = t.context.user

  // Add an entry to update
  const addRes = await app.inject({
    url: '/entries',
    method: 'POST',
    payload: {
      example: 'dataToUpdate'
    },
    ...headers(accessToken)
  })

  // Update the entry
  const entryId = addRes.json().id
  const updateRes = await app.inject({
    url: `/entries/${entryId}`,
    method: 'PATCH',
    payload: {
      updatedExample: 'updatedData'
    },
    ...headers(accessToken)
  })
  assert.equal(updateRes.statusCode, 204)

  // Check that entry has been updated
  const res = await app.inject({
    url: '/entries',
    method: 'GET',
    ...headers(accessToken)
  })
  assert.equal(res.json()[0].data.updatedExample, 'updatedData')
})

test('Delete entry', async (t) => {
  const { app } = t.context
  const { accessToken } = t.context.user

  // Add an entry to delete
  const addRes = await app.inject({
    url: '/entries',
    method: 'POST',
    payload: {
      example: 'dataToDelete'
    },
    ...headers(accessToken)
  })

  const entryId = addRes.json().id

  // Delete the entry
  const deleteRes = await app.inject({
    url: `/entries/${entryId}`,
    method: 'DELETE',
    ...headers(accessToken)
  })

  assert.equal(deleteRes.statusCode, 204)

  // Check that the entry has been deleted
  const fetchRes = await app.inject({
    url: '/entries',
    method: 'GET',
    ...headers(accessToken)
  })

  assert.equal(fetchRes.statusCode, 200)
  assert.equal(fetchRes.json().length, 0)
})

function headers (token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}
