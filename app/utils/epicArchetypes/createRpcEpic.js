import { EPIC_END } from 'redux-observable'
// FIXME: Don't load full Observable,
import { Observable } from 'rxjs/Rx'
// instead load as
// import { Observable } from 'rxjs/Observable'
// with only needed operators
// import { fromPromise } from 'rxjs/operator/fromPromise'
import { mapTo } from 'rxjs/operator/mapTo'
import { take } from 'rxjs/operator/take'
import changeCase from 'change-case'

// fetch does not throw on anything but network errors
// thus status needs to be passed down along with body
const responseToJson = response =>
  response.json()
    .then(cleanJson => ({
      code: response.status,
      body: cleanJson,
    }))

// check kind of response by code
// then return stream of success actions or stream of failure actions
// in case of 401, then failure stream includes action.type === `UNAUTHORIZED`
const mapResponseToSuccessOrFailureStream = type => response => {
  if (response.code >= 200 && response.code < 300) {
    return Observable.of(rpcSuccess(type)(response.body))
  }
  // handle error
  const failure = rpcFailure(type)(response)
  const unauthorized = { type: `UNAUTHORIZED` }
  const actions = response.code !== 401
    ? [failure]
    : [failure, unauthorized]
  return Observable.of(...actions)
}

// action creators
export const rpcRequest = type => payload =>
  ({ type: `${type}_REQUEST`, payload })

export const rpcSuccess = type => payload =>
  ({ type: `${type}_SUCCESS`, payload })

export const rpcFailure = type => ({ xhr, body }) =>
  ({ type: `${type}_FAILURE`, payload: xhr ? xhr.response : body })

// Race between the AJAX call and an EPIC_END.
// If the EPIC_END, emit a cancel action to
// put the store in the correct state
// This is needed for hot reloading
/**
 * [rpcEpic description]
 * @param  {String} type          [eg, 'create user']
 * @param  {function} createUrl   [eg, ({ id }) => `/users/{id}`]
 * @param  {Object} [settings={}] [eg, { method: 'POST' }]
 * @return {Observable}           [description]
 */
export const rpcEpic = (type, createUrl, settings = {}) => action$ =>
  action$.ofType(`${type}_REQUEST`)
    .mergeMap(action => {
      // prep data
      const body = action.payload
        && typeof action.payload.toJS === 'function'
          ? action.payload.toJS()
          : action.payload
      const url = `/api/${createUrl(body)}`
      const payload = Object.assign(
        {
          body: JSON.stringify(body),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
        settings
      )
      // fetch from url, with payload
      return Observable.race(
        Observable.fromPromise(fetch(url, payload).then(responseToJson))
          .switchMap(mapResponseToSuccessOrFailureStream(type))
          .takeUntil(action$.ofType(`${type}_ABORTED`))
          .catch(rpcFailure(type)),
        action$.ofType(EPIC_END)
          ::take(1)
          ::mapTo({ type: `${type}_ABORTED` })
      )
    })

/**
 * [description]
 * @param  {String} type [eg, 'fetch user']
 * @param  {Function} createUrl [should return url string]
 * @param  {Object} settings [eg, { method: 'GET' }]
 * @return {Object} [consisting of reuest action and epic]
 *
 * Eg,
 * const { fetchUserRequest, fetchUserEpic } = rpcEpic('fetch user', payload => `/api/user/${payload.userId}`)
 */
export default (type, createUrl, settings = {}) => {
  const TYPE = changeCase.constantCase(type)
  const typeCamel = changeCase.camelCase(type)

  return {
    [`${typeCamel}Request`]: rpcRequest(TYPE),
    [`${typeCamel}Epic`]: rpcEpic(TYPE, createUrl, settings),
  }
}
