import { connect } from 'react-redux'
import CoreLayout from 'layouts/CoreLayout'
import home from './home'
import counter from './counter'
import login from './login'

const mapStateToProps = state => ({
  me: state.get('me'),
})

const mapDispatchToProps = dispatch => ({
  command: type => payload => dispatch({
    type: 'COMMAND',
    payload: {
      type,
      payload,
    },
  }),
  query: type => payload => dispatch({
    type: 'QUERY',
    payload: {
      type,
      payload,
    },
  }),
})

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path: '/',
  component: connect(mapStateToProps, mapDispatchToProps)(CoreLayout),
  indexRoute: home,
  childRoutes: [
    counter(store),
    login(store),
  ],
})

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
