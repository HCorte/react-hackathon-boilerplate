const {
  userQueriesList: userUserQueriesList,
} = require('./user.access')

module.exports = {
  userQueriesList: []
    .concat(userUserQueriesList),
}
