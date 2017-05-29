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

// Upon LOG_ME_IN_SUCCESS connect to all rooms relevant to user
export const logMeInSuccessEpic = socket => action$ =>
  action$.ofType(`LOG_ME_IN_SUCCESS`)
    .forEach(() => {
      // sockets close && open is needed to reset socket connection
      socket.close()
      socket.open('', { forceNew: true })
    })

// Upon LOG_ME_OUT_SUCCESS remove `me` (with token) from localStorage
// NOTE: LOG_ME_OUT_SUCCESS is used in local reducers to reset as needed
export const logMeOutSuccessEpic = socket => action$ =>
  action$.ofType(`LOG_ME_OUT_SUCCESS`)
    .forEach(() => {
      localStorage.removeItem('me')
      socket.close()
      socket.open('', { forceNew: true })
    })

// LOG_ME_OUT_REQUEST presumes success of logMeOutEpic (to avoid race issues)
// and so disconnects the user from all his rooms
// Should logMeOutEpic fail, then see next two epics
export const logMeOutRequestEpic = action$ =>
  action$.ofType(`LOG_ME_OUT_REQUEST`)
    ::mapTo({
      type: `COMMAND`,
      payload: {
        type: `leaveMyRooms`,
      },
    })

// If logMeOutEpic fails, then join back on user's socket
export const logMeOutFailureEpic = action$ =>
  action$.ofType(`LOG_ME_OUT_FAILURE`)
    ::mapTo({
      type: `COMMAND`,
      payload: {
        type: `joinMyRooms`,
      },
    })

// If logMeOutEpic gets aborted, then join back on user's socket
export const logMeOutAbortedEpic = action$ =>
  action$.ofType(`LOG_ME_OUT_ABORTED`)
    ::mapTo({
      type: `COMMAND`,
      payload: {
        type: `joinMyRooms`,
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
  LOG_ME_IN_SUCCESS: (state, action) => action.payload.user
    ? fromJS(action.payload.user)
    : fromJS(action.payload),
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
