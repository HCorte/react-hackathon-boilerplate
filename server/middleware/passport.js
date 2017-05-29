const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const debug = require('debug')('boilerplate:middleware:passport')

const userQueries = require('../queries/user')
const {
  checkPassword,
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

passport.serializeUser((data, done) => {
  debug(`passport.serializeUser: data =`, data)
  done(null, data)
})

passport.use(
  'local-login',
  new LocalStrategy(localConfig, (req, username, password, done) =>
    userQueries._getUser({ username, email: req.body.email })
      .then(user => { // eslint-disable-line consistent-return
        debug(`passport: local-login: user =`, user)
        console.warn(`passport: local-login: user =`, user)
        if (!user) {
          slowDone('User not found.', done)
        } else if (!checkPassword(password, user)) {
          slowDone('Invalid Password.', done)
        } else {
          const token = createToken(user._id, user.role)
          return done(null, sanitizeUser(Object.assign({ token }, user)))
        }
      })
      .catch(err => {
        debug(`ERROR: passport: local-login: err =`, err)
        done(err)
      })
  )
)

module.exports = passport
