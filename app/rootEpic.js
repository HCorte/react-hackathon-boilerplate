/**
 * https://redux-observable.js.org/docs/basics/SettingUpTheMiddleware.html
 *
 * Just like redux requiring a single root Reducer, redux-observable also
 * requires you to have a single root Epic.
 */

import 'rxjs/add/operator/mergeMap'

export const rootEpic = epic$ => (action$, store) =>
  epic$.mergeMap(epic =>
    epic(action$, store)
  )

export default rootEpic
