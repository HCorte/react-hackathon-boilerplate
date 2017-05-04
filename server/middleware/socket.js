/**
 * FIXME:
 * Map up `commands` and `queries` to socket.on
 * Hookup security
 */
const redis = require('redis').createClient
const adapter = require('socket.io-redis')
const passportSocketIo = require('passport.socketio')
const debug = require('debug')('boilerplate:middleware:socket')

const storePlus = require('./storePlus')

const unfilteredCommands = require('../commands')
const unfilteredQueries = require('../queries')

const attachRedis = () => {
  // Setup redis connection
  const redisPubOpts = {}
  const redisSubOpts = { return_buffers: true }

  const redisUrl = process.env.REDIS_URL || `redis://localhost:6379`

  const pubClient = redis(redisUrl, redisPubOpts)
  const subClient = redis(redisUrl, redisSubOpts)

  return adapter({ pubClient, subClient })
}

const usePassport = cookieParser => {
  const onAuthorizeSuccess = (data, accept) => {
    console.log('successful connection to socket.io')

    accept()
  }

  const onAuthorizeFail = (data, message, error, accept) => {
    console.log(`onAuthorizeFail: = `, message, error)

    if (error) throw new Error(message)

    console.warn('onAuthorizeFail: failed connection to socket.io:', message)

    // If you don't want to accept the connection
    // if (error) accept(new Error(message))
    // this error will be sent to the user as a special error-package
    // see: http://socket.io/docs/client-api/#socket > error-object

    // this makes security optional
    // so that quries also function for those not logged in
    accept()
  }

  const basicPassportSettings = {
    success: onAuthorizeSuccess, // *optional* callback on success
    fail: onAuthorizeFail, // *optional* callback on fail/error
  }

  const settings = Object.assign(
    basicPassportSettings,
    storePlus,
    { cookieParser }
  )

  return passportSocketIo.authorize(settings)
}


const _createObjectFromKeys = sourceObject => (targetObject, key) =>
  Object.assign({ [key]: sourceObject[key] }, targetObject)

const adminCommandList = []
const userCommands = Object.keys(unfilteredCommands)
  // remove commands with leading underscore, ie, remove private functions
  .filter(c => c[0] !== '_')
  // remove admin only commands
  .filter(c => !adminCommandList.some(ac => ac === c))
  .reduce(_createObjectFromKeys(unfilteredCommands), {})
debug(`command: userCommands =`, userCommands)

const adminCommands = adminCommandList
  .reduce(_createObjectFromKeys(unfilteredCommands), {})
debug(`command: adminCommands =`, adminCommands)

const userQueriesList = []
const userQueries = userQueriesList
  .reduce(_createObjectFromKeys(unfilteredQueries), {})
debug(`command: userQueries =`, userQueries)

const publicQueries = Object.keys(unfilteredQueries)
  // remove commands with leading underscore, ie, remove private functions
  .filter(q => q[0] !== '_')
  // remove admin only commands
  .filter(q => !adminCommandList.some(uq => uq === q))
  .reduce(_createObjectFromKeys(unfilteredQueries), {})
debug(`command: publicQueries =`, publicQueries)

/**
 * connection:
 * on connection, check for session, if so, pass back user (me)
 * handle commands and queries
 */
const connection = io =>
  socket => {
    console.warn('socket<connection>') // eslint-disable-line
    console.log('connection: socket.request.user =', socket.request.user)
    socket.emit('event', {
      type: `SocketConnected`,
      payload: {},
    })
    // FIXME: on connection if session, then return user (getMe)


    socket.on('command', data => {
      console.warn(`socket<command>: data =`, data)
      console.log('command: socket.request.user =', socket.request.user)

      const isUserCommand = Reflect.has(userCommands, data.type)
      const isAdminCommand = Reflect.has(adminCommands, data.type)
      if (isUserCommand || isAdminCommand) {
        // check if user is attached by middleware,
        const userIsLoggedIn = socket.request.user.logged_in

        if (!userIsLoggedIn) {
          socket.emit('event', {
            type: 'CommandRejected',
            code: 401, // user not authorized / logged in
            payload: data,
          })
        } else { // user is logged in so proceed
          if (isUserCommand) { // eslint-disable-line
            userCommands[data.type](io, socket, data)
          } else {
            const isAdminUser = false
            if (!isAdminUser) {
              socket.emit('event', {
                type: 'CommandRejected',
                code: 403, // user does not have correct role
                payload: data,
              })
            } else {
              adminCommands[data.type](io, socket, data)
            }
          }
        }
      } else {
        socket.emit('event', {
          type: 'CommandRejected',
          code: 404, // command not found
          payload: data,
        })
      }
    })

    socket.on('query', data => {
      console.warn(`socket<query>: data =`, data)
      console.log('query: socket.request.user =', socket.request.user)

      socket.emit('event', {
        type: 'QueryRejected',
        code: 404,
        payload: data,
      })
    })
  }

module.exports = {
  attachRedis,
  usePassport,
  connection,
}
