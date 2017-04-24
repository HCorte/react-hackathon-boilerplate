import { getAsyncInjectors } from 'utils/asyncInjectors'

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err) // eslint-disable-line no-console
}

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default)
}

const route = 'counter'

export default (store) => {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store) // eslint-disable-line no-unused-vars

  return {
    path: route,
    name: route,
    getComponent(nextState, cb) {
      const importModules = Promise.all([
        import('./containers/CounterContainer'),
        import('./modules/counter'),
      ])
      const renderRoute = loadModule(cb)

      importModules.then(([component, reducer]) => {
        injectReducer(route, reducer.default)

        renderRoute(component)
      })

      importModules.catch(errorLoading)
    },
  }
}
