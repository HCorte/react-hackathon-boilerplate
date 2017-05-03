import createRpcEpic from 'utils/epicArchetypes/createRpcEpic'

const type = 'log in user'
const createUrl = () => `/login`
const { logInUserEpic } = createRpcEpic(type, createUrl)

export const epics = [logInUserEpic]
// ------------------------------------
// Action Handlers
// ------------------------------------
// ------------------------------------
// Reducer
// ------------------------------------

// No actions handlers or reducer,
// instead it uses `/containers/User/reducer.js`
