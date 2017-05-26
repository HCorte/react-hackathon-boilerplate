import { constantCase } from 'change-case'
import { map } from 'rxjs/operator/map'
import { fromJS } from 'immutable'

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
 */
export const routeEpic = action$ =>
  action$.ofType(`@@router/LOCATION_CHANGE`)
  ::map(({ payload }) => mapLocationToAction(payload))

export const epics = [routeEpic]
