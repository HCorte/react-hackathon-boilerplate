import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { combineEpics } from 'redux-observable'
import conformsTo from 'lodash/conformsTo'
import isEmpty from 'lodash/isEmpty'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import invariant from 'invariant'
import warning from 'warning'
import createReducer from 'reducers'

/**
 * Validate the shape of redux store
 */
export function checkStore(store) {
  const shape = {
    dispatch: isFunction,
    subscribe: isFunction,
    getState: isFunction,
    replaceReducer: isFunction,
    asyncReducers: isObject,
  }
  invariant(
    conformsTo(store, shape),
    '(app/utils...) asyncInjectors: Expected a valid redux store'
  )
}

/**
 * Inject an asynchronously loaded reducer
 */
export function injectAsyncReducer(store, isValid) {
  return function injectReducer(name, asyncReducer) {
    if (!isValid) checkStore(store)

    invariant(
      isString(name) && !isEmpty(name) && isFunction(asyncReducer),
      '(app/utils...) injectAsyncReducer: Expected `asyncReducer` to be a reducer function'
    )

    if (Reflect.has(store.asyncReducers, name)) return

    store.asyncReducers[name] = asyncReducer // eslint-disable-line no-param-reassign
    store.replaceReducer(createReducer(store.asyncReducers))
  }
}

/**
 * Setup to allow async loading of epics as per
 * https://redux-observable.js.org/docs/recipes/AddingNewEpicsAsynchronously.html
 *
 * Used registerEpic (to avoid double loading) from
 *  http://stackoverflow.com/questions/40202074/is-it-an-efficient-practice-to-add-new-epics-lazily-inside-react-router-onenter
 */
export const epicRegistry = [] // Epic registry
export const epic$ = new BehaviorSubject(combineEpics(...epicRegistry))

/**
 * Inject an asynchronously loaded epic
 */
export function injectAsyncEpics(store, isValid) {
  return function injectEpics(epics) {
    if (!isValid) checkStore(store)

    invariant(
      Array.isArray(epics) && epics.map(isFunction).reduce((p, n) => p && n, true),
      '(app/utils...) injectAsyncEpics: Expected `epics` to be an array of epic functions'
    )

    warning(
      !isEmpty(epics),
      '(app/utils...) injectAsyncEpics: Received an empty `epics` array'
    )

    epics.forEach(epic => {
      // don't add an epic that is already registered/running
      if (epicRegistry.indexOf(epic) === -1) {
        epicRegistry.push(epic)
        epic$.next(epic)
      }
    })
  }
}


/**
 * Helper for creating injectors
 */
export function getAsyncInjectors(store) {
  checkStore(store)

  return {
    injectReducer: injectAsyncReducer(store, true),
    injectEpics: injectAsyncReducer(store, true),
    // FIXME: remove
    // injectSagas: injectAsyncSagas(store, true),
  }
}
