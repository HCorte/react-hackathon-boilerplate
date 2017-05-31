/**
 * Commands are exposed via sockets.
 * The default for commands is that the require user authentication.
 *
 * For commands that require user rights,
 * are defined in the *.access.js files
 *
 * adminQueriesList is an array of the commands requiring admin level access
 * userQueriesList is an array of the commands requiring user level access
 */

const {
  userQueriesList: userUserQueriesList,
} = require('./user.access')

module.exports = {
  userQueriesList: []
    .concat(userUserQueriesList),
}
