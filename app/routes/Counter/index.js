import { getAsyncInjectors } from 'utils/asyncInjectors'

const errorLoading = err => {
  console.error('Dynamic page loading failed', err) // eslint-disable-line no-console
}

const loadModule = cb => componentModule => {
  cb(null, componentModule.default)
}

const name = 'counter'

export default (store) => {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectEpics } = getAsyncInjectors(store)

  return {
    path: name,
    name,
    getComponent(nextState, cb) {
      const importModules = Promise.all([
        import('./containers/CounterContainer'),
        import('./modules/counter'),
      ])
      const renderRoute = loadModule(cb)

      importModules.then(([component, mod]) => {
        injectReducer(name, mod.default)
        injectEpics(mod.epics)

        renderRoute(component)
      })

      importModules.catch(errorLoading)
    },
  }
}
