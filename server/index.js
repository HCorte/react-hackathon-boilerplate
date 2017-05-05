/* eslint consistent-return:0 */

const express = require('express')
const http = require('http')
const logger = require('./logger')
const passport = require('passport')
const resolve = require('path').resolve
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const socketio = require('socket.io')

const argv = require('minimist')(process.argv.slice(2))
const setup = require('./middleware/frontend')
const sessionMiddleware = require('./middleware/session')
const socketMiddleware = require('./middleware/socket')

const isDev = process.env.NODE_ENV !== 'production'
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
  ? require('ngrok')
  : false

const app = express()
const server = http.Server(app)

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);
/*
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
*/

// FIXME: add helmet for security purposes
app.use(bodyParser.json())
// app.use(cookieParser(process.env.COOKIE_SECRET || 'c00k13_s3cr3t', {}))
app.use(cookieParser())

// Initialize session
if (process.env.NODE_ENV === 'production') {
  // if cookie is secure, then allow trust of proxy on production
  app.set('trust proxy', 1)
}
app.use(sessionMiddleware)
// Initialize Passport (with session)
app.use(passport.initialize())
app.use(passport.session())
require('./middleware/passport')(passport)

const io = socketio(server)
io.adapter(socketMiddleware.attachRedis())
io.use(socketMiddleware.usePassport(cookieParser))
io.on('connection', socketMiddleware.connection(io))

// Setup REST routes
require('./middleware/routes')(passport, app)

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
})

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST
const host = customHost || null // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost'

const port = argv.port || process.env.PORT || 3000

// Start your app.
// eslint-disable-next-line arrow-parens
server.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message)
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr)
      }

      logger.appStarted(port, prettyHost, url)
    })
  } else {
    logger.appStarted(port, prettyHost)
  }
})
