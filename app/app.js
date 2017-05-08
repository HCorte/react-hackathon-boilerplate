/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// FIXME: What is this needed for???
import 'babel-polyfill'

// Import all the third party stuff
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyRouterMiddleware, Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { useScroll } from 'react-router-scroll'
import 'sanitize.css/sanitize.css'

import io from 'socket.io-client/dist/socket.io'
import { constantCase } from 'change-case'

// Import selector for `syncHistoryWithStore`
// FIXME: move this to User or move User to App
import { makeSelectLocationState } from 'containers/App/selectors'

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider'

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./favicon.ico'
import '!file-loader?name=[name].[ext]!./manifest.json'
import 'file-loader?name=[name].[ext]!./.htaccess'
/* eslint-enable import/no-unresolved, import/extensions */

import configureStore from './store'
import { epic$ } from './utils/asyncInjectors'
import { commandEpic, queryEpic } from './containers/App/module'
import { logInUserSuccessEpic, logOutUserSuccessEpic } from './containers/User/module'

//
// // Import i18n messUserages
import { translationMessages } from './i18n'

// Import CSS reset and Global Styles
import './global-styles'

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const initialState = {}
const store = configureStore(initialState, browserHistory)

// Sync history and store, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: makeSelectLocationState(),
})

const MOUNT_NODE = document.getElementById('app')

const renderApp = messages => {
  // eslint-disable-next-line global-require
  const routes = require('./routes/index').default(store)

  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <Router
          {...{ history, routes }}
          render={
            // Scroll to top when going to a new page,
            // imitating default browser behaviour
            applyRouterMiddleware(useScroll())
          }
          />
      </LanguageProvider>
    </Provider>,
    MOUNT_NODE
  )
}

const isDev = (process.env.NODE_ENV === 'development' && module.hot)

const renderError = !isDev
  ? () => {}
  : (error) => {
    // eslint-disable-next-line global-require
    const RedBox = require('redbox-react').default

    ReactDOM.render(<RedBox {...{ error }} />, MOUNT_NODE)
  }

const render = !isDev
  ? (messages) => renderApp(messages)
  : (messages) => {
    try {
      renderApp(messages)
    } catch (error) {
      console.error(error) // eslint-disable-line
      renderError(error)
    }
  }

// FIXME: refactor to HOC ???
const socket = io('', { forceNew: true })

epic$.next(logInUserSuccessEpic(socket))
epic$.next(logOutUserSuccessEpic(socket))
epic$.next(commandEpic(socket))
epic$.next(queryEpic(socket))

socket.on('connect', () => {
  console.debug(`socket<connect>`)
  // FIXME: Handle re-connection (data: redux reset & load new)
  socket.emit(`query`, { type: `getUser` })
})
socket.on('disconnect', reason => {
  console.debug(`socket<disconnect>: reason =`, reason)
  // FIXME: on disconnect reset appropriate data in redux
})
socket.on(`event`, data => {
  const type = constantCase(data.type)
  const reduxAction = { ...data, type }
  store.dispatch(reduxAction)
  if (data.type === 'CommandRejected'
    || data.type === 'QueryRejected'
  ) {
    const reduxActionFailure = {
      ...data.payload,
      type: `${constantCase(data.payload.type)}_FAILURE`,
    }
    store.dispatch(reduxActionFailure)
  }
  console.debug(`socket<event>: reduxAction =`, reduxAction)
})

// Hot reloadable translation json files
if (module.hot) {
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept('./i18n', () => {
    render(translationMessages)
  })
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  (new Promise(resolve => {
    resolve(import('intl'))
  }))
    .then(() => Promise.all([
      import('intl/locale-data/jsonp/en.js'),
    ]))
    .then(() => render(translationMessages))
    .catch(err => {
      throw err
    })
} else {
  render(translationMessages)
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install() // eslint-disable-line global-require
}
