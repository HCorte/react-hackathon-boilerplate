import { constantCase } from 'change-case'
import { map } from 'rxjs/operator/map'

/**
 * commandEpic
 * Listens `COMMAND` actions,
 * then emits a `command` event via socket (with token if available)
 * then emits a "CONVERTED_COMMAND" redux action
 *
 * eg, { type: `COMMAND`, payload: { type: `doSomething` }}
 * causes socket.emit(`command`, { type: doSomething, token })
 * and returns { type: `DO_SOMETHING` }
 */

// FIXME: refactor both to call a single function
export const commandEpic = socket => (action$, store) =>
  action$.ofType(`COMMAND`)
    ::map(({ payload }) => {
      // add token based security to the command
      const token = store.getState().getIn(['me', 'token'])
      const command = Object.assign({ token }, payload)
      socket.emit(`command`, command)
      return {
        type: constantCase(command.type),
        payload: command.payload,
      }
    })

export const queryEpic = socket => (action$, store) =>
  action$.ofType(`QUERY`)
    ::map(({ payload }) => {
      // add token based security to the command
      const token = store.getState().getIn(['me', 'token'])
      const query = Object.assign({ token }, payload)
      socket.emit(`query`, query)
      return {
        type: constantCase(query.type),
        payload: query.payload,
      }
    })

export const epics = [commandEpic, queryEpic]
