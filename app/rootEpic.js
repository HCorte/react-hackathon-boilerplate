import 'rxjs/add/operator/mergeMap'

export const rootEpic = epic$ => (action$, store) =>
  epic$.mergeMap(epic =>
    epic(action$, store)
  )

export default rootEpic
