/**
 * Events are passed back to the FE with REST codes
 */

const debug = require('debug')('playvs:middleware:events')
const changeCase = require('change-case')

/**
 * emit event with failure information
 * @param  {Object} socket     [the socket object]
 * @param  {String} type       [commandName]
 * @param  {Number} [code=500] [REST code]
 * @param  {Object} error      [should be of the format { error: 'message' }]
 */
const failure = (socket, type, code = 500) => error => {
  const message = typeof error === 'string' ? error : error.message
  socket.emit('event', {
    type: changeCase.pascalCase(`${type} Failed`),
    code,
    payload: { error: message },
  })
}

/**
 * command gets rejected if uncaught error
 * @param  {Object} socket     [the socket object]
 * @param  {String} type       [commandName]
 * @param  {Number} [code=500] [REST code]
 * @param  {Object} payload    [payload of command]
 */
const reject = (socket, type, code = 500) => payload =>
    socket.emit('event', {
      type: changeCase.pascalCase(`${type} Rejected`),
      code,
      payload,
    })

/**
 * emit event when command successful
 * @param  {Object} socket     [the socket object]
 * @param  {String} type       [event name, eg, USER_CREATED]
 * @param  {Number} [code=500] [REST code]
 * @param  {Object} payload    [payload of command]
 */
const success = (socket, type, code = 200) => payload =>
  socket.emit('event', {
    type: changeCase.pascalCase(type),
    code,
    payload,
  })

/**
 * commands throw to elicit errors
 * these can be converted into failure events
 *
 * other errors are of course possible,
 * if these do not contain messages,
 * then the COMMAND_REJECTED or QUERY_REJECTED event gets sent
 */
const error = CommandOrQuery => (socket, data) => err => {
  debug(`ERROR: err =`, err)
  if (err && err.message) {
    failure(socket, data.type)(err.message)
  } else {
    const payload = Object.assign({}, data, { error: err || 'Unknown error' })
    reject(socket, CommandOrQuery)(payload)
  }
}

module.exports = {
  failure,
  error,
  reject,
  success,
}
