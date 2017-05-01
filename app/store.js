/**
 * Create the store with asynchronously loaded reducers
 */

import { createStore, applyMiddleware, compose } from 'redux'
import { fromJS } from 'immutable'
import { routerMiddleware } from 'react-router-redux'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { combineEpics, createEpicMiddleware } from 'redux-observable'
import createReducer from './reducers'
import rootEpic from './rootEpic'

const epicMiddleware = createEpicMiddleware(rootEpic)

export default function configureStore(initialState = {}, history) {
  // Create the store with two middleware
  // 1. epicMiddleware: Makes redux-observables work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middleware = [
    epicMiddleware,
    routerMiddleware(history),
  ]

  const enhancers = [
    applyMiddleware(...middleware),
  ]

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
  /* eslint-enable */

  const store = createStore(
    createReducer(),
    fromJS(initialState),
    composeEnhancers(...enhancers)
  )

  // Extensions
  store.asyncReducers = {} // Async reducer registry
  /**
   * Setup to allow async loading of epics as per
   * https://redux-observable.js.org/docs/recipes/AddingNewEpicsAsynchronously.html
   *
   * Used registerEpic (to avoid double loading) from
   *  http://stackoverflow.com/questions/40202074/is-it-an-efficient-practice-to-add-new-epics-lazily-inside-react-router-onenter
   */
  store.epicRegistry = [] // Epic registry
  store.epic$ = new BehaviorSubject(combineEpics(...store.epicRegistry))

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      import('./reducers').then(reducerModule => {
        const createReducers = reducerModule.default
        const nextReducers = createReducers(store.asyncReducers)

        store.replaceReducer(nextReducers)
      })
    })
    // https://redux-observable.js.org/docs/recipes/HotModuleReplacement.html
    module.hot.accept('./rootEpic', () => {
      import('./rootEpic').then(rootEpicModule => {
        const freshRootEpic = rootEpicModule.default
        epicMiddleware.replaceEpic(freshRootEpic)
      })
    })
  }

  return store
}
