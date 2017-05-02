const { dissoc } = require('ramda')
const moment = require('moment')
const bcrypt = require('bcrypt')

const checkPassword = (password, user) =>
  bcrypt.compareSync(password, user.password)

const generateHash = password =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)

const isActiveUser = user =>
  user.active
  && (!user.bannedUntil || moment(user.bannedUntil).isAfter(new Date()))

const sanitizeUser = user => dissoc('password', user)


module.exports = {
  checkPassword,
  generateHash,
  isActiveUser,
  sanitizeUser,
}
