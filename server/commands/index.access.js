/**
 * Commands are exposed via sockets.
 * The default for commands is that the require user authentication.
 *
 * For commands that require admin user rights, or are open to the public,
 * are defined in the *.access.js files
 *
 * adminCommandList is an array of the commands requiring admin level access
 * publicCommandList is an array of the commands open to the public
 */

const {
  adminCommandList: userAdminCommandList,
  publicCommandList: userPublicCommandList,
} = require('./user.access')

module.exports = {
  adminCommandList: []
    .concat(userAdminCommandList),
  publicCommandList: []
    .concat(userPublicCommandList),
}
