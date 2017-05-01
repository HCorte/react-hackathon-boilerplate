import 'rxjs/add/operator/mergeMap'

export const rootEpic = (action$, store) =>
  store.epic$.mergeMap(epic =>
    epic(action$, store)
  )

export default rootEpic
