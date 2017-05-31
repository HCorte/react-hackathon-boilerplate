const User = require('../models/User')

const _createUser = data => {
  const user = new User(data) // use mongoose to cleanup the data
  return user.save() // save data to mongodb
    .then(u => u.toObject())
    // FIXME: sanitizeUser, or change the mongoose security model
}

module.exports = {
  _createUser,
}
