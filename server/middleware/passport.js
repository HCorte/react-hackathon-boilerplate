const LocalStrategy = require('passport-local').Strategy

const userQueries = require('../queries/user')
const {
  checkPassword,
  isActiveUser,
  sanitizeUser,
} = require('./user')

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

  passport.use(
    'local-login',
    new LocalStrategy(localConfig, (req, username, password, done) =>
      userQueries._getUser({ username, email: req.body.email })
        .then(user => {
          if (!user) {
            slowDone('User not found', done)
          } else if (!checkPassword(password, user)) {
            slowDone('Invalid Password', done)
          } else if (!isActiveUser(user)) {
            slowDone('Your account has been deactivated', done)
          } else {
            done(null, sanitizeUser(user))
          }
        })
        .catch(err => done(err))
    )
  )
}
