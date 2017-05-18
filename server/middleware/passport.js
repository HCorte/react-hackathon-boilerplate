const LocalStrategy = require('passport-local').Strategy
const moment = require('moment')
const debug = require('debug')('boilerplate:middleware:passport')

const userQueries = require('../queries/user')
const {
  checkPassword,
  isActiveUser,
  sanitizeUser,
} = require('./user')
const { createToken } = require('./token')

const localConfig = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true,
}

// use slowDone to avoid multi-attempt attacks
const slowDone = (msg, done) =>
  setTimeout((msg2, done2) => {
    done2(msg2)
  }, 2000, msg, done)

module.exports = passport => {
  passport.serializeUser((data, done) => {
    debug(`passport.serializeUser: data =`, data)
    done(null, data)
  })
  /*
  // Below express-session middleware
  // Pass just the user id to the passport middleware
  passport.serializeUser(({ _id }, done) => {
    done(null, _id)
  })

  // Reading your user base ont he user.id
  passport.deserializeUser((_id, done) => {
    userQueries._getUser({ _id })
      .then(user => {
        done(null, sanitizeUser(user))
      })
  })
  */

  passport.use(
    'local-login',
    new LocalStrategy(localConfig, (req, username, password, done) =>
      userQueries._getUser({ username, email: req.body.email })
        .then(user => { // eslint-disable-line consistent-return
          debug(`passport: local-login: user =`, sanitizeUser(user))
          console.error('ERROR: user =', user)
          console.error('ERROR: user.password =', user && user.password)
          if (!user) {
            slowDone('User not found', done)
          /*
          } else if (!checkPassword(password, user)) {
            slowDone('Invalid Password', done)
          */
          } else {
            const token = createToken(user._id, user.role)
            return done(null, sanitizeUser(Object.assign({ token }, user)))
          }
        })
        .catch(err => done(err))
    )
  )
}
