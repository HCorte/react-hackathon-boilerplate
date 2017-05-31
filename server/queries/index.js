/**
 * Queries are exposed via sockets.
 * The default for queries is that they are open to the public
 *
 * For queries that require admin or user rights,
 * are defined in the *.access.js files
 *
 * Leading underscores are used for private functions,
 * that won't be exposed via sockets.
 */

const user = require('./user')

module.exports = Object.assign({},
  user
)
