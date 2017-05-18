import { fromJS } from 'immutable'
import { mapTo } from 'rxjs/operator/mapTo'
import { map } from 'rxjs/operator/map'

import createRpcEpic from 'utils/epicArchetypes/createRpcEpic'

/**
 * Epics
 */
const type = 'log me out'
const createUrl = () => 'logout'
const method = 'POST'

// FIXME: hide data in redux, because this a login
const { logMeOutEpic, logMeOutRequest } = createRpcEpic(type, createUrl, { method })

export const requests = {
  logMeOutRequest,
}

export const logMeInSuccessEpic = socket => action$ =>
  action$.ofType(`LOG_ME_IN_SUCCESS`)
    ::map(() => {
      console.warn(`logMeInSuccessEpic: reset socket`)
      socket.close()
      socket.open('', { forceNew: true })
      return {
        type: `COMMAND`,
        payload: {
          type: `joinMySocket`,
        },
      }
    })
    /*
    .forEach(() => {
      console.warn(`logMeInSuccessEpic: reset socket`)
      socket.close()
      socket.open('', { forceNew: true })
    })
    ::mapTo({
      type: `COMMAND`,
      payload: {
        type: `joinMySocket`,
      },
    })
    */

export const logMeOutSuccessEpic = socket => action$ =>
  action$.ofType(`LOG_ME_OUT_SUCCESS`)
    .forEach(() => {
      localStorage.removeItem('me')
      console.warn(`logMeOutSuccessEpic: reset socket`)
      socket.close()
      socket.open('', { forceNew: true })
    })

export const logMeOutRequestEpic = action$ =>
  action$.ofType(`LOG_ME_OUT_REQUEST`)
    ::mapTo({
      type: `COMMAND`,
      payload: {
        type: `leaveMySocket`,
      },
    })

// If logout fails, then join back on user's socket
export const logMeOutFailureEpic = action$ =>
  action$.ofType(`LOG_ME_OUT_FAILURE`)
    ::mapTo({
      type: `COMMAND`,
      payload: {
        type: `joinMySocket`,
      },
    })

// If logout gets aborted, then join back on user's socket
export const logMeOutAbortedEpic = action$ =>
  action$.ofType(`LOG_ME_OUT_ABORTED`)
    ::mapTo({
      type: `COMMAND`,
      payload: {
        type: `joinMySocket`,
      },
    })

export const epics = [logMeInSuccessEpic, logMeOutSuccessEpic, logMeOutEpic, logMeOutRequestEpic, logMeOutFailureEpic, logMeOutAbortedEpic]

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = fromJS({})

const ACTION_HANDLERS = {
  // reduce 'log me in' actions
  LOG_ME_IN_REQUEST: () => fromJS({ isLoading: true }),
  LOG_ME_IN_SUCCESS: (state, action) => fromJS(action.payload),
  LOG_ME_IN_FAILURE: (state, action) => action.payload.error
    ? fromJS(action.payload)
    : fromJS({ error: action.payload }),
  LOG_ME_IN_ABORTED: () => initialState,
  // reduce 'log me up' actions
  LOG_ME_OUT_SUCCESS: () => initialState,
  // reduce 'sign me up' actions
  SIGN_ME_UP_REQUEST: () => fromJS({ isLoading: true }),
  SIGN_ME_UP_SUCCESS: (state, action) => fromJS(action.payload),
  SIGN_ME_UP_FAILURE: (state, action) => fromJS({ error: action.payload }),
  SIGN_ME_UP_ABORTED: () => initialState,
}

// ------------------------------------
// Reducer
// ------------------------------------
export const reducer = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

export default reducer
