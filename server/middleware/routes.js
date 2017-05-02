module.exports = (passport, app) => {
  app.post('/login', passport.authenticate('local-login'), (req, res) => {
    res.json({ user: req.user })
  })
}
