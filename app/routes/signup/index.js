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
  name: 'signMeUp',
  path: 'signup',
}

/**
 * CHANGE NOTHING BELOW THIS LINE
 * the function below uses config above
 */
export default (store) => {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectEpics } = getAsyncInjectors(store)

  // define variables as set via config
  const { name } = config
  const path = config.path || name.toLowerCase()
  // cannot use change-case on FE... :'(
  const container = config.container || name[0].toUpperCase() + name.slice(1)
  const redux = config.redux || name

  return {
    path,
    name,
    getComponent(nextState, cb) {
      const importModules = Promise.all([
        import(`./containers/${container}`),
        import(`./modules/${redux}`),
      ])
      const renderRoute = loadModule(cb)

      importModules.then(([component, mod]) => {
        if (mod.default) injectReducer(name, mod.default)
        if (mod.epics) injectEpics(mod.epics)

        renderRoute(component)
      })

      importModules.catch(errorLoading)
    },
  }
}
