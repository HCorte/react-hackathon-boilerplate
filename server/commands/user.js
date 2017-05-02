const User = require('../models/User')

const _createUser = data => {
  // use mongoose to cleanup the data
  const user = new User(data)
  // save data to mongodb

  return user.save()
}

module.exports = {
  _createUser,
}
