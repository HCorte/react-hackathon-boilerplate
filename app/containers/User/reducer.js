import { fromJS } from 'immutable'

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = fromJS({})

const ACTION_HANDLERS = {
  LOG_IN_USER_REQUEST: () => fromJS({ isLoading: true }),
  LOG_IN_USER_SUCCESS: (state, action) => fromJS(action.payload),
  LOG_IN_USER_FAILURE: (state, action) => fromJS({ error: action.payload }),
  LOG_IN_USER_ABORTED: () => initialState,
  LOG_OUT_USER: () => initialState,
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function counterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
