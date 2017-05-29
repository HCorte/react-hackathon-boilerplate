import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import { createEpicMiddleware } from 'redux-observable'
import fetchMock from 'fetch-mock'
import expect from 'expect'

import createRpcEpic from '../createRpcEpic'

const type = 'fetch user'
const createUrl = ({ id }) => `users/${id}`
const { fetchUserEpic } = createRpcEpic(type, createUrl)

const epicMiddleware = createEpicMiddleware(fetchUserEpic)
const mockStore = configureMockStore([epicMiddleware])

describe('fetchUserEpic', () => {
  let store


  beforeEach(() => {
    // eslint-disable-next-line no-undef
    jasmine.getEnv().defaultTimeoutInterval = 5000
    store = mockStore()
  })

  afterEach(() => {
    fetchMock.restore()
    nock.cleanAll()
    epicMiddleware.replaceEpic(fetchUserEpic)
  })

  it('fetches succesfully', done => {
    const payloadRequest = { id: 123 }
    const payloadResponse = { name: 'Bob the builder' }
    fetchMock.get('/api/users/123', payloadResponse)

    store.dispatch({ type: `FETCH_USER_REQUEST`, payload: payloadRequest })

    setTimeout(() => {
      expect(store.getActions()).toEqual([
        { type: `FETCH_USER_REQUEST`, payload: payloadRequest },
        { type: `FETCH_USER_SUCCESS`, payload: payloadResponse },
      ])
      done()
    }, 100)
  })

  it('handles unauthorized', done => {
    const payloadRequest = { id: 123 }
    const payloadError = { error: 'Not authorized' }
    fetchMock.get('*', { status: 401, body: payloadError })

    store.dispatch({ type: `FETCH_USER_REQUEST`, payload: payloadRequest })

    setTimeout(() => {
      expect(store.getActions()).toEqual([
        { type: `FETCH_USER_REQUEST`, payload: payloadRequest },
        { type: `FETCH_USER_FAILURE`, payload: payloadError },
        { type: `UNAUTHORIZED` },
      ])
      done()
    }, 100)
  })
})
