import createRpcEpic from 'utils/epicArchetypes/createRpcEpic'

const type = 'log me in'
const createUrl = () => 'login'
const method = 'POST'

// FIXME: hide data in redux, because this a login
const { logMeInEpic, logMeInRequest } = createRpcEpic(type, createUrl, { method })

export const requests = {
  logMeInRequest,
}

export const epics = [logMeInEpic]

// ------------------------------------
// Action Handlers
// ------------------------------------
// ------------------------------------
// Reducer
// ------------------------------------

// No actions handlers or reducer,
// instead it uses `/modules/me`
