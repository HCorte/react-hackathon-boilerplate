/**
 * FIXME:
 * Map up `commands` and `queries` to socket.on
 * Hookup security
 */
const socketio = require('socket.io')
const redis = require('redis').createClient
const adapter = require('socket.io-redis')

const setup = server => {
  const io = socketio(server)

  // Setup redis connection
  const redisPubOpts = {}
  const redisSubOpts = { return_buffers: true }

  const redisUrl = process.env.REDIS_URL || `redis://localhost:6379`

  const pubClient = redis(redisUrl, redisPubOpts)
  const subClient = redis(redisUrl, redisSubOpts)

  io.adapter(adapter({ pubClient, subClient }))

  return io
}

module.exports = setup
