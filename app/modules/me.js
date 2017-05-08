import { fromJS } from 'immutable'

/**
 * Epics
 */
export const logMeInSuccessEpic = socket => action$ =>
  action$.ofType(`LOG_ME_IN_SUCCESS`)
    .forEach(() => {
      console.warn(`logMeInSuccessEpic: reset socket`)
      socket.close()
      socket.open('', { forceNew: true })
    })

export const logMeOutSuccessEpic = socket => action$ =>
  action$.ofType(`LOG_ME_OUT_SUCCESS`)
    .forEach(() => {
      localStorage.removeItem('me')
      console.warn(`logMeOutSuccessEpic: reset socket`)
      socket.close()
      socket.open('', { forceNew: true })
    })

export const epics = [logMeInSuccessEpic, logMeOutSuccessEpic]

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = fromJS({})

const ACTION_HANDLERS = {
  LOG_IN_USER_REQUEST: () => fromJS({ isLoading: true }),
  LOG_ME_IN_SUCCESS: (state, action) => fromJS(action.payload),
  LOG_IN_USER_FAILURE: (state, action) => fromJS({ error: action.payload }),
  LOG_IN_USER_ABORTED: () => initialState,
  LOG_OUT_USER: () => initialState,
}

// ------------------------------------
// Reducer
// ------------------------------------
export const reducer = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

export default reducer
