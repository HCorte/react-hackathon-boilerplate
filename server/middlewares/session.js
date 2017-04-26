// Sets up a session store with Redis
const expressSession = require('express-session')
const redisUrl = require('redis-url')
const RedisStore = require('connect-redis')(expressSession)

const url = process.env.REDIS_URL || `redis://localhost:6379`
const client = redisUrl.connect(url)
const store = new RedisStore({ client })

const sessionMiddleware = expressSession({
  cookie: {
    maxAge: 2419200000,
    // If secure is set, and you access your site over HTTP,
    // the cookie will not be set.
    // If you have your node.js behind a proxy and are using secure: true,
    // you need to set "trust proxy" in express
    secure: process.env.ENVIRONMENT !== 'development'
      && process.env.ENVIRONMENT !== 'test',
  },
  // name: process.env.COOKIE_NAME || 'c00k13_n4m3',
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET || 'c00k13_s3cr3t',
  store,
})

module.exports = sessionMiddleware
