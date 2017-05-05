import createRpcEpic from 'utils/epicArchetypes/createRpcEpic'

const type = 'log in user'
const createUrl = () => `login`
const method = 'POST'

// FIXME: hide data in redux, because this a login
const { logInUserEpic, logInUserRequest } = createRpcEpic(type, createUrl, { method })

export const requests = {
  logInUserRequest,
}
export const epics = [logInUserEpic]

// ------------------------------------
// Action Handlers
// ------------------------------------
// ------------------------------------
// Reducer
// ------------------------------------

// No actions handlers or reducer,
// instead it uses `/containers/User/reducer.js`
