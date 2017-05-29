import { constantCase } from 'change-case'
import { map } from 'rxjs/operator/map'
import { fromJS } from 'immutable'
import { LOCATION_CHANGE } from 'react-router-redux'

// makeSelectLocationState expects a plain JS object for the routing state
export const makeSelectLocationState = () => {
  let prevRoutingState
  let prevRoutingStateJS

  return (state) => {
    const routingState = state.get('route') // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState
      prevRoutingStateJS = routingState.toJS()
    }

    return prevRoutingStateJS
  }
}

export const selectors = {
  makeSelectLocationState,
}

export const mapLocationToAction = ({ params, pathname, query }) => ({
  type: `/${constantCase(pathname) || ''}`,
  payload: fromJS({ query, params }),
})

/**
 * This epic emits on location change
 * type === pathname
 * payload === { query }
 *
 * This allows stateless containers, as fetches can be coupled
 * via epics listening to their specific routes, ie, pathnames
 *
 * eg, { type: `@@router/LOCATION_CHANGE`, payload: { params, pathname: 'about', query }}
 * returns { type: `/ABOUT`, payload: { params, query } }
 * which can be used in routes' epics to kick-off, eg, fetch
 */
export const routeEpic = action$ =>
  action$.ofType(`@@router/LOCATION_CHANGE`)
  ::map(({ payload }) => mapLocationToAction(payload))

export const epics = [routeEpic]

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */
const initialState = fromJS({
  locationBeforeTransitions: null,
})

/**
 * Merge route into the global application state
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      return state.merge({
        locationBeforeTransitions: action.payload,
      })
    default:
      return state
  }
}

export default reducer
