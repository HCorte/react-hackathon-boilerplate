// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  LOG_IN_USER_REQUEST: () => ({
    ...initialState,
    isLoading: true,
  }),
  LOG_IN_USER_SUCCESS: (state, action) => action.payload,
  LOG_IN_USER_FAILURE: (state, action) => action.payload,
  LOG_IN_USER_ABORTED: () => initialState,
  LOG_OUT_USER: () => initialState,
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {}
export default function counterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
