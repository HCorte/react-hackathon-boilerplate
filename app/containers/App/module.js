import changeCase from 'change-case'
import { map } from 'rxjs/operator/map'


export const commandEpic = socket => action$ =>
  action$.ofType(`COMMAND`)
    ::map(({ payload: command }) => {
      socket.emit(`command`, command)
      return {
        type: changeCase.constantCase(command.type),
        payload: command.payload,
      }
    })

export const queryEpic = socket => action$ =>
  action$.ofType(`QUERY`)
    ::map(({ payload: query }) => {
      socket.emit(`query`, query)
      return {
        type: changeCase.constantCase(query.type),
        payload: query.payload,
      }
    })

export default [commandEpic, queryEpic]
