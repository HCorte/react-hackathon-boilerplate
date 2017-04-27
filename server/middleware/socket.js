/**
 * FIXME:
 * Map up `commands` and `queries` to socket.on
 * Hookup security
 */
const redis = require('redis').createClient
const adapter = require('socket.io-redis')
const passportSocketIo = require('passport.socketio')

const storePlus = require('./storePlus')

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

/**
 * connection: upon connection send event to FE
 * @return {undefined} [description]
 */
const connection = () =>
  socket => {
    console.warn('socket<connection>') // eslint-disable-line
    socket.emit('event', {
      type: `SocketConnected`,
      payload: {},
    })
  }

const command = () => {
  // load commands
  // strip out those leading with '_'
  // check that user authed
  return data => {
    console.warn(`socket<command>: data =`, data)
  }
}

const query = () => {
  // load queries
  // strip out those leading with '_'
  // check that user us authed for certain queries
  return data => {
    console.warn(`socket<query>: data =`, data)
  }
}

module.exports = {
  attachRedis,
  usePassport,
  connection,
  command,
  query,
}
