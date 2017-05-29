const User = require('../models/User')

const _createUser = data => {
  const user = new User(data) // use mongoose to cleanup the data
  return user.save() // save data to mongodb
    .then(u => u.toObject())
    // FIXME: sanitizeUser, or change the mongoose security model
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
