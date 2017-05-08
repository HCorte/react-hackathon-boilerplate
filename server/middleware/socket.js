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

const usePassport = (/* cookieParser, passport */) => {
  const onAuthorizeSuccess = (data, accept) => {
    console.log('successful connection to socket.io')

    accept()
  }

  const onAuthorizeFail = (data, message, error, accept) => {
    console.log(`onAuthorizeFail: = `, message, error)

    if (error) throw new Error(message)

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
    // { cookieParser, passport }
    {}
  )

  return passportSocketIo.authorize(settings)
}


const _createObjectFromKeys = sourceObject => (targetObject, key) =>
  Object.assign({ [key]: sourceObject[key] }, targetObject)
/**
 * commands by default require a user to be logged in,
 * but some require admin priviliges, ie, adminCommandList
 */
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


/**
 * queries by default are available to public.,
 * except for those that required user to be signed in, ie, userQueriesList
 */
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
    // console.log('connection: Object.keys(socket.request) =', Object.keys(socket.request))
    console.log('connection: socket.request.sessionID =', socket.request.sessionID)
    console.log('connection: socket.request.cookie =', socket.request.cookie)
    console.log('connection: socket.request.user =', socket.request.user)

    socket.emit('event', { type: `SocketConnected` })

    const userIsLoggedIn = socket.request.user.logged_in
    const isAdminUser = socket.request.user.role === 'admin'

    if (userIsLoggedIn) {
      // FIXME: on connection if session, then return user (getMe)
    }

    socket.on('command', data => {
      console.warn(`socket<command>: data =`, data)

      const isUserCommand = Reflect.has(userCommands, data.type)
      const isAdminCommand = Reflect.has(adminCommands, data.type)

      if (isUserCommand && userIsLoggedIn) {
        userCommands[data.type](io, socket, data)
      } else if (isAdminCommand && isAdminUser) {
        adminCommands[data.type](io, socket, data)
      } else if (!userIsLoggedIn) {
        socket.emit('event', {
          type: 'CommandRejected',
          code: 401, // user not authorized / logged in
          payload: data,
        })
      } else if (isAdminCommand && !isAdminUser) {
        socket.emit('event', {
          type: 'CommandRejected',
          code: 403, // user does not have correct role
          payload: data,
        })
      } else if (!isUserCommand && !isAdminCommand) {
        socket.emit('event', {
          type: 'CommandRejected',
          code: 404, // command not found
          payload: data,
        })
      }
    })

    socket.on('query', data => {
      console.warn(`socket<query>: data =`, data)

      const isUserQuery = Reflect.has(userQueries, data.type)
      const isPublicQuery = Reflect.has(publicQueries, data.type)
      if (isPublicQuery) {
        publicQueries[data.type](io, socket, data)
      } else if (isUserQuery && userIsLoggedIn) {
        userQueries[data.type](io, socket, data)
      } else if (isUserQuery && !userIsLoggedIn) {
        socket.emit('event', {
          type: 'CommandRejected',
          code: 401, // user not authorized / logged in
          payload: data,
        })
      } else if (!isUserQuery && !isPublicQuery) {
        socket.emit('event', {
          type: 'QueryRejected',
          code: 404,
          payload: data,
        })
      }
    })
  }

module.exports = {
  attachRedis,
  usePassport,
  connection,
}
