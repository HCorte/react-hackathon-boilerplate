import createRpcEpic from 'utils/epicArchetypes/createRpcEpic'

const type = 'sign me up'
const createUrl = () => 'signup'
const method = 'POST'

// FIXME: hide data in redux, because this a login
const { signMeUpEpic, signMeUpRequest } = createRpcEpic(type, createUrl, { method })

export const requests = {
  signMeUpRequest,
}

export const epics = [signMeUpEpic]

// ------------------------------------
// Action Handlers
// ------------------------------------
// ------------------------------------
// Reducer
// ------------------------------------

// No actions handlers or reducer,
// instead it uses `/modules/me`
