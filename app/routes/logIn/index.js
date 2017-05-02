import { pascalCase } from 'change-case'
import { getAsyncInjectors } from 'utils/asyncInjectors'
import { errorLoading, loadModule } from 'utils/asyncLoaders'

/**
 * @name [String]       Required. It is the name of the component, and used to
 *                      as default for other values.
 * @path [String]       Optional. Used as `path` or `name.toLowerCase()`
 * @container [String]  Optional. Used to async load `/containers/${container}`
 *                      or `/containers/${pascalCase(name)}`
 * @redux [String]      Optional. Used to async load `./modules/${redux}`
 *                      or `./modules/${name}`
 */
const config = {
  name: 'logIn',
  container: 'LogIn', // this should not be necessary
}

export default (store) => {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectEpics } = getAsyncInjectors(store)

  const {
    container,
    redux,
    name,
    path,
  } = config

  return {
    path: path || name.toLowerCase(),
    name,
    getComponent(nextState, cb) {
      const importModules = Promise.all([
        import(`./containers/${container || pascalCase(name)}`),
        import(`./modules/${redux || name}`),
      ])
      const renderRoute = loadModule(cb)

      importModules.then(([component, mod]) => {
        injectReducer(name, mod.default)
        if (mod.epics) injectEpics(mod.epics)

        renderRoute(component)
      })

      importModules.catch(errorLoading)
    },
  }
}
