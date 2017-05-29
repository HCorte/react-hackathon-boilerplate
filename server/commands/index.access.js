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
