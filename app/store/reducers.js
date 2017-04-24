// FIXME: integrate react-redux-starter-kit with local


import { combineReducers } from 'redux'
// import locationReducer from './location'

export const makeRootReducer = (asyncReducers) =>
  combineReducers({
    // location: locationReducer,
    ...asyncReducers
  })


export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
