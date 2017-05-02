const Promise = require('bluebird')
const {
  pick,
  compose,
  evolve,
  toLower,
} = require('ramda')
const { generateHash } = require('../middleware/user')

const _getUser = query => {
  const cleanQuery = compose(
    evolve({
      email: toLower,
      username: toLower,
    }),
    pick(['_id', 'username', 'email'])
  )(query)

  console.warn(`getUser: cleanQuery =`, cleanQuery)

  return Promise.resolve({
    _id: 'safkj13th3pj1pu4gh1p3u94gbq',
    username: 'jan-jan',
    password: generateHash('password'),
    active: true,
  })
}

module.exports = {
  _getUser,
}
