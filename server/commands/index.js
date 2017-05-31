/**
 * Commands are exposed via sockets.
 * The default for commands is that the require user authentication.
 *
 * For commands that require admin rights, or are open to the public,
 * are defined in the *.access.js files
 *
 * Leading underscores are used for private functions,
 * that won't be exposed via sockets.
 */

const user = require('./user')

module.exports = Object.assign({},
  user
)
