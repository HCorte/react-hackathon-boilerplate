import { EPIC_END } from 'redux-observable'
import { Observable } from 'rxjs/Observable'
// import { race } from 'rxjs/observable/race'
import { ajax } from 'rxjs/observable/dom/ajax'
// import 'rxjs/observable/race'
// import 'rxjs/observable/dom/ajax'
import changeCase from 'change-case'

const race = Observable.race

// action creators
export const rpcRequest = type => payload => ({ type: `${type}_REQUEST`, payload })
export const rpcSuccess = type => payload => ({ type: `${type}_SUCCESS`, payload })

// Race between the AJAX call and an EPIC_END.
// If the EPIC_END, emit a cancel action to
// put the store in the correct state
// This is needed for hot reloading
export const rpcEpic = (type, createUrl) => action$ =>
  action$.ofType(`${type}_REQUEST`)
    .mergeMap(action =>
      race(
        ajax.getJSON(createUrl(action.payload))
          .map(rpcSuccess)
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
            const actions = error.xhr.code !== 403
              ? [failure]
              : [failure, unauthorized]
            return Observable.of(actions)
          }),
        action$.ofType(EPIC_END)
          .take(1)
          .mapTo({ type: `${type}_ABORTED` })
      )
    )
/**
 * [description]
 * @param  {String} type [eg, 'fetch user']
 * @param  {Function} createUrl [should return url string]
 * @return {Object} [consisting of reuest action and epic]
 *
 * Eg,
 * const { fetchUserRequest, fetchUserEpic } = rpcEpic('fetch user', payload => `/api/user/${payload.userId}`)
 */
export default (type, createUrl) => {
  const TYPE = changeCase.constantCase(type)
  const typeCamel = changeCase.camelCase(type)

  return {
    [`${typeCamel}Request`]: rpcRequest(TYPE),
    [`${typeCamel}Epic`]: rpcEpic(TYPE, createUrl),
  }
}
