const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

mongoose.Promise = require('bluebird')

mongoose.connection.on('error', err => {
  console.error('MongoDB error: %s', err)
})

const mongoAuth = {}
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost/rhb`
const connection = mongoose.connect(MONGODB_URI, mongoAuth)

autoIncrement.initialize(connection)

module.exports = app => app.set('mongoose', connection)
