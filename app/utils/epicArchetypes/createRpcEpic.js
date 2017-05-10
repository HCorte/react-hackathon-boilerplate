import { EPIC_END } from 'redux-observable'
// FIXME: Don't load full Observable,
import { Observable } from 'rxjs/Rx'
// instead load as
// import { Observable } from 'rxjs/Observable'
// with only needed operators
// import { fromPromise } from 'rxjs/add/observable/fromPromise'
import { mapTo } from 'rxjs/operator/mapTo'
import { take } from 'rxjs/operator/take'
import changeCase from 'change-case'

// action creators
export const rpcRequest = type => payload => ({ type: `${type}_REQUEST`, payload })
export const rpcSuccess = type => payload => ({ type: `${type}_SUCCESS`, payload })

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
      const url = `/api/${createUrl(action.payload.toJS())}`
      const payload = Object.assign(
        {
          body: JSON.stringify(action.payload.toJS()),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
        settings
      )

      return Observable.race(
        Observable.fromPromise(fetch(url, payload))
          .map(data => {
            console.warn(`Observable.fromPromise: ${type}: data =`, data)
            return data
          })
          .map(rpcSuccess(type))
          .takeUntil(action$.ofType(`${type}_ABORTED`))
          .catch(error => {
            const failure = {
              type: `${type}_FAILURE`,
              payload: error.xhr.response,
              error: true,
            }
            const unauthorized = {
              type: `UNAUTHORIZED`,
            }
            const actions = error.xhr.code !== 401
              ? [failure]
              : [failure, unauthorized]
            return Observable.of(actions)
          }),
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
