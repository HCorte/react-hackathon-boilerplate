import { delay } from 'rxjs/operator/delay'
import { mapTo } from 'rxjs/operator/mapTo'

// ------------------------------------
// Constants
// ------------------------------------
export const COUNTER_INCREMENT = 'COUNTER_INCREMENT'
export const COUNTER_DOUBLE_REQUEST = 'COUNTER_DOUBLE_REQUEST'
export const COUNTER_DOUBLE_ASYNC = 'COUNTER_DOUBLE_ASYNC'

// ------------------------------------
// Actions
// ------------------------------------
export const increment = (payload = 1) => ({
  type: COUNTER_INCREMENT,
  payload,
})

export const doubleAsync = () => ({
  type: COUNTER_DOUBLE_REQUEST,
})

export const doubleAsyncEpic = action$ /* , store*/ =>
  action$.ofType(COUNTER_DOUBLE_REQUEST)
    ::delay(200)
    ::mapTo({ type: COUNTER_DOUBLE_ASYNC })

export const actions = {
  increment,
  doubleAsync,
}

export const epics = [doubleAsyncEpic]

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [COUNTER_INCREMENT]: (state, action) => state + action.payload,
  [COUNTER_DOUBLE_ASYNC]: state => state * 2,
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = 0
export default function counterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
