/**
 * FIXME:
 * Map up `commands` and `queries` to socket.on
 * Hookup security
 */
const redis = require('redis').createClient
const adapter = require('socket.io-redis')
const passportSocketIo = require('passport.socketio')
const debug = require('debug')('playvs:middleware:socket')
const changeCase = require('change-case')
const { evolve } = require('ramda')

const storePlus = require('./storePlus')
const { authParticulars } = require('./token')
const { error, reject } = require('./events')
const { adminCommandList, publicCommandList } = require('../commands/index.access')
const { userQueriesList } = require('../queries/index.access')

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

// FIXME: passportSocketIo is no longer being used. Remove
const usePassport = (/* cookieParser, passport */) => {
  const onAuthorizeSuccess = (data, accept) => {
    debug('successful connection to socket.io')

    accept()
  }

  const onAuthorizeFail = (data, message, err, accept) => {
    debug(`onAuthorizeFail: = `, message, err)

    if (err) {
      // FIXME !!!
      if (message === 'Passport was not initialized') {
        console.error(`ERROR: onAuthorizeFail: This is major problem resolve: message = `, message)
      } else {
        throw new Error(message)
      }
    }

    // If you don't want to accept the connection
    // if (err) accept(new Error(message))
    // this err will be sent to the user as a special error-package
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
 * and some can be available to the public, ie, publicCommandList
 */
const userCommands = Object.keys(unfilteredCommands)
  // remove commands with leading underscore, ie, remove private functions
  .filter(c => c[0] !== '_')
  // remove admin only commands
  .filter(c => !adminCommandList.some(ac => ac === c))
  // remove public commands
  .filter(c => !publicCommandList.some(ac => ac === c))
  .reduce(_createObjectFromKeys(unfilteredCommands), {})
debug(`command: userCommands =`, userCommands)

const adminCommands = adminCommandList
  .reduce(_createObjectFromKeys(unfilteredCommands), {})
debug(`command: adminCommands =`, adminCommands)

const publicCommands = publicCommandList
  .reduce(_createObjectFromKeys(unfilteredCommands), {})
debug(`command: publicCommands =`, publicCommands)

const _handleCommandError = error('Command')

/**
 * queries by default are available to public.,
 * except for those that required user to be signed in, ie, userQueriesList
 */
const userQueries = userQueriesList
  .reduce(_createObjectFromKeys(unfilteredQueries), {})
debug(`command: userQueries =`, userQueries)

const publicQueries = Object.keys(unfilteredQueries)
  // remove commands with leading underscore, ie, remove private functions
  .filter(q => q[0] !== '_')
  .filter(q => !adminCommandList.some(uq => uq === q))
  .reduce(_createObjectFromKeys(unfilteredQueries), {})
debug(`command: publicQueries =`, publicQueries)

const _handleQueryError = error('Query')

/**
 * connection:
 * on connection, check for session, if so, pass back user (me)
 * handle commands and queries
 */
const connection = io =>
  socket => {
    debug('socket<connection>') // eslint-disable-line
    // debug('connection: Object.keys(socket.request) =', Object.keys(socket.request))
    /*
    debug('connection: socket.request.headers =', socket.request.headers)
    debug('connection: socket.request.sessionID =', socket.request.sessionID)
    debug('connection: socket.request.cookie =', socket.request.cookie)
    debug('connection: socket.request.user =', socket.request.user)
    */
    socket.emit('event', { type: `SocketConnected` })

    // const userIsLoggedIn = socket.request.user.logged_in
    // const isAdminUser = socket.request.user.role === 'admin'

    socket.on('command', rawData => {
      const data = evolve({ type: changeCase.camelCase })(rawData)
      console.warn(`socket<command>: data =`, data)

      const isUserCommand = Reflect.has(userCommands, data.type)
      const isAdminCommand = Reflect.has(adminCommands, data.type)
      const isPublicCommand = Reflect.has(publicCommands, data.type)

      const {
        token,
        userIsLoggedIn,
        isAdminUser,
      } = authParticulars(data.token)
      const { payload } = data
      const bundle = { io, socket, token, payload }
      if (isUserCommand && userIsLoggedIn) {
        userCommands[data.type](bundle)
          .catch(_handleCommandError(socket, data))
      } else if (isAdminCommand && isAdminUser) {
        adminCommands[data.type](bundle)
          .catch(_handleCommandError(socket, data))
      } else if (isPublicCommand) {
        publicCommands[data.type](bundle)
          .catch(_handleCommandError(socket, data))
      } else if (!userIsLoggedIn) {
        // user not authorized, ie, not logged in
        reject(socket, 'Command', data, 401)
      } else if (isAdminCommand && !isAdminUser) {
        // user does not have correct role
        reject(socket, 'Command', data, 403)
      } else /* if (!isUserCommand && !isAdminCommand && !isPublicCommand)*/ {
        // command not found
        reject(socket, 'Command', data, 404)
      }
    })

    socket.on('query', rawData => {
      const data = evolve({ type: changeCase.camelCase })(rawData)
      console.warn(`socket<query>: data =`, data)

      const isUserQuery = Reflect.has(userQueries, data.type)
      const isPublicQuery = Reflect.has(publicQueries, data.type)

      const {
        token,
        userIsLoggedIn,
        // isAdminUser,
      } = authParticulars(data.token)
      const { payload } = data
      const bundle = { io, socket, token, payload }
      if (isPublicQuery) {
        publicQueries[data.type](bundle)
          .catch(_handleQueryError(socket, data))
      } else if (isUserQuery && userIsLoggedIn) {
        userQueries[data.type](bundle)
          .catch(_handleQueryError(socket, data))
      } else if (isUserQuery && !userIsLoggedIn) {
        // user not authorized, ie, not logged in
        reject(socket, 'Query', data, 401)
      } else /* if (!isUserQuery && !isPublicQuery) */ {
        // query not found
        reject(socket, 'Query', data, 404)
      }
    })
  }


module.exports = {
  attachRedis,
  usePassport,
  connection,
}
