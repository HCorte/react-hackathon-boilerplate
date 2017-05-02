const Promise = require('bluebird')
const {
  pick,
  compose,
  evolve,
} = require('ramda')
const { generateHash } = require('../middleware/user')

const toLowerCase = str => typeof str === 'string'
  ? str.toLowerCase()
  : str

const _getUser = query => {
  const cleanQuery = compose(
    evolve({
      email: toLowerCase,
      username: toLowerCase,
    }),
    pick(['_id', 'username', 'email'])
  )(query)

  console.error(`\nERROR: _getUser NOT implemented\n`)
  console.warn(`_getUser: cleanQuery =`, cleanQuery)

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
