const jwt = require('jwt-simple')
const moment = require('moment')

const JWT_SECRET = process.env.JWT_SECRET || 'should define secret in .env'

const authParticulars = rawToken => {
  const token = rawToken && jwt.decode(rawToken, JWT_SECRET)
  const userIsLoggedIn = token
    && token.expires >= moment().valueOf()
  const isAdminUser = userIsLoggedIn
    && token.userRole === 'admin'
  return { token, userIsLoggedIn, isAdminUser }
}

const createToken = (userId, userRole, expires) =>
  jwt.encode({ userId, userRole, expires }, JWT_SECRET)

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
