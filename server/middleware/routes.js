const userQueries = require('../queries/user')
const User = require('../models/User')

module.exports = (passport, app) => {
  app.post('signup', (req, res) => {
    userQueries._getUser(req.body)
      .delay(2000)
      .then(existingUser => {
        if (existingUser) throw new Error('A user already exists.')
        const user = new User(req.body)
        return user.save()
      })
      .then(user => {
        req.login(req.body, err => {
          if (err) throw new Error(err)
          res.status(201).send({ user })
        })
      })
      // FIXME: Get the correct format for REST errors
      .catch(err => { res.status(500).json({ error: err.message }) })
  })

  app.post('login', passport.authenticate('local-login'), (req, res) => {
    res.json({ user: req.user })
  })
}
