const jwt = require('jwt-simple')
const moment = require('moment')

const JWT_SECRET = process.env.JWT_SECRET || 'should define secret in .env'

// authParticulars is used in socket
// to determine whether a user is allowed to execute a command or query
const authParticulars = rawToken => {
  const token = rawToken && jwt.decode(rawToken, JWT_SECRET)
  const userIsLoggedIn = token
    && token.expires >= moment().valueOf()
  const isAdminUser = userIsLoggedIn
    && token.userRole === 'admin'
  return { token, userIsLoggedIn, isAdminUser }
}

/**
 * createToken
 * @param  {String} userId     [description]
 * @param  {String} userRole   [eg, 'user', 'admin', etc]
 * @param  {Number} [days=365] [number of days valid]
 * @return {String}            [jwt]
 */
const createToken = (userId, userRole, days = 365) => {
  const expires = moment().add(days, 'days').valueOf()
  return jwt.encode({ userId, userRole, expires }, JWT_SECRET)
}

/**
 * return whether a token is that user's token && whether it is valid
 * @param  {String} token   [jwt]
 * @param  {String} userId  [_id of a user]
 * @return {Boolean}
 */
const validateToken = (token, userId) => {
  const decoded = jwt.decode(token, JWT_SECRET)
  return decoded.userId === userId.toString()
    && decoded.expires >= moment().valueOf()
}

module.exports = {
  authParticulars,
  createToken,
  validateToken,
}
