const expressSession = require('express-session')
const storePlus = require('./storePlus')

const basicSettings = {
  cookie: {
    maxAge: 2419200000,
    // If secure is set, and you access your site over HTTP,
    // the cookie will not be set.
    // If you have your node.js behind a proxy and are using secure: true,
    // NOTE: If secure you need to set "trust proxy" in express
    secure: process.env.NODE_ENV === 'production',
  },
  // name: 'express.sid',
  name: process.env.COOKIE_NAME || 'c00k13_n4m3',
  resave: false,
  saveUninitialized: false,
}

const settings = Object.assign(basicSettings, storePlus)

const sessionMiddleware = expressSession(settings)

module.exports = sessionMiddleware
