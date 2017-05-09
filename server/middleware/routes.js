const userQueries = require('../queries/user')
const userCommands = require('../queries/user')


module.exports = (passport, app) => {
  app.post('/api/signup', (req, res) => {
    userQueries._getUser(req.body)
      .delay(2000)
      .then(existingUser => {
        if (existingUser) throw new Error('A user already exists.')
        return userCommands._createUser(req.body)
      })
      .then(user => {
        req.login(req.body, err => {
          if (err) throw new Error(err)
          res.status(201).send(user)
        })
      })
      // FIXME: Get the correct format for REST errors
      .catch(err => { res.status(500).json({ error: err.message }) })
  })

  app.post('/api/login', passport.authenticate('local-login'), (req, res) => {
    res.json(req.user)
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
