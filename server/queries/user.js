const {
  pick,
  compose,
  evolve,
  reject,
} = require('ramda')
const Promise = require('bluebird')
const User = require('../models/User')
const isUndefined = require('../utils/isUndefined')

const toLowerCase = str => typeof str === 'string'
  ? str.toLowerCase()
  : str

const _getUser = query => {
  /*
  // FIXME:
  const cleanQuery = compose(
    reject(isUndefined),
    evolve({
      email: toLowerCase,
      username: toLowerCase,
    }),
    pick(['_id', 'username', 'email'])
  )(query)
  */
  const cleanQuery = { username: query.username.toLowerCase() }
  console.warn(`_getUser: cleanQuery =`, cleanQuery)
  console.warn(`_getUser: FIXME: to get on either username OR email`)
  return User.findOne(cleanQuery)
    .lean()
    .exec()
}

module.exports = {
  _getUser,
}
