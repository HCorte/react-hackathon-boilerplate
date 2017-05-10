import nock from 'nock'
import expect from 'expect'
import configureMockStore from 'redux-mock-store'
import { createEpicMiddleware } from 'redux-observable'
import createRpcEpic from '../createRpcEpic'

const type = 'fetch user'
const createUrl = ({ id }) => `http://example.com/api/users/${id}`
const { fetchUserEpic } = createRpcEpic(type, createUrl)

const epicMiddleware = createEpicMiddleware(fetchUserEpic)
const mockStore = configureMockStore([epicMiddleware])

describe('fetchUserEpic', () => {
  let store

  beforeEach(() => {
    store = mockStore()
  })

  afterEach(() => {
    nock.cleanAll()
    epicMiddleware.replaceEpic(fetchUserEpic)
  })

  it('produces the user model', () => {
    const payload = { id: 123 }
    nock('http://example.com/')
      .get('/api/users/123')
      .reply(200, payload)

    store.dispatch({ type: `FETCH_USER_REQUEST` })

    expect(store.getActions()).toEqual([
      { type: `FETCH_USER_REQUEST` },
      { type: `FETCH_USER_SUCCESS`, payload },
    ])
  })

  it('unauthorized', () => {
    const payload = { error: 'Not authorized' }
    nock('http://example.com/')
      .get('/api/users/123')
      .reply(403, payload)

    store.dispatch({ type: `FETCH_USER_REQUEST` })

    expect(store.getActions()).toEqual([
      { type: `FETCH_USER_REQUEST` },
      { type: `FETCH_USER_FAILURE`, payload, error: true },
      { type: `UNAUTHORIZED` },
    ])
  })
})
