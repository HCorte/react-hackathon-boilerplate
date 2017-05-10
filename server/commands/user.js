const User = require('../models/User')

const _createUser = data => {
  // use mongoose to cleanup the data
  const user = new User(data)
  // save data to mongodb
  return user.save()
}


/**
 * Commands are exposed via sockets.
 * The default for commands is that the require user authentication.
 *
 * For commands that require admin user rights,
 * need to be split off first in middleware/socket
 *
 * Leading underscores are used for private functions,
 * that won't be exposed via sockets.
 */

module.exports = {
  _createUser,
}
