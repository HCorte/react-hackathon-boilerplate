const debug = require('debug')('boilerplate:middleware:routes')
const userQueries = require('../queries/user')
const userCommands = require('../commands/user')
const { sanitizeUser } = require('./user')
const { createToken } = require('./token')

module.exports = (passport, app) => {
  app.post('/api/signup', (req, res) => {
    userQueries._getUser(req.body)
      .delay(2000)
      .then(existingUser => {
        if (existingUser) throw new Error('That user already exists.')
        return userCommands._createUser(req.body)
      })
      .then(user => {
        req.login(req.body, err => {
          if (err) throw new Error(err)
          const token = createToken(user._id, user.role)
          res.status(201).send(sanitizeUser(Object.assign({ token }, user)))
        })
      })
      // FIXME: Get the correct format for REST errors
      .catch(err => { res.status(500).json({ error: err.message }) })
  })

  /*
  app.post('/api/login', passport.authenticate('local-login'), (req, res) => {
    res.json(req.user)
  })
  */

  app.post('/api/login', (req, res, next) => {
    passport.authenticate(
      'local-login',
      // { session: false },
      (err, user, info) => { // eslint-disable-line consistent-return
        if (err) {
          return res.status(500).send({ error: { message: err } })
        }
        debug(`/api/login: user =`, user)
        debug(`/api/login: info =`, info)
        // Generate a JSON response reflecting authentication status
        if (!user) {
          return info
            ? res.status(401).send({ error: { message: info.message } })
            : res.status(500).send({ error: { message: 'Unknown error.' } })
        }
        req.login(user, error => {
          if (error) {
            return next(error)
          }
          return res.send({ user })
        })
      })(req, res, next)
  })

  app.get('/api/logout', (req, res) => {
    req.logOut()
    req.session.destroy(err => {
      if (err) console.warn(`logout: err =`, err)
      // FIXME: redirect is probably senseless
      // res.redirect('/') // Inside a callback… bulletproof!
      res.json()
    })
  })
}
