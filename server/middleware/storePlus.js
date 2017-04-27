/**
 * Create store and basic settings for session.js and socket.js
 */

// Sets up a session store with Redis
const expressSession = require('express-session')
const redisUrl = require('redis-url')
const RedisStore = require('connect-redis')(expressSession)

const url = process.env.REDIS_URL || `redis://localhost:6379`
const client = redisUrl.connect(url)
const store = new RedisStore({ client })

const plus = {
  key: process.env.COOKIE_KEY || 'c00k13_k3y',
  secret: process.env.COOKIE_SECRET || 'c00k13_s3cr3t',
  store,
}

module.exports = plus
