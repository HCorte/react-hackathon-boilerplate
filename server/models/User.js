const mongoose = require('mongoose')
const { generateHash } = require('../middleware/user')

const email = {
  type: String,
  required: true,
  unique: true,
  // index: true,
}

const username = {
  type: String,
  required: true,
  unique: true,
  maxlength: 15,
  minlength: 2,
  // index: true,
}
const password = {
  type: String,
  select: false,
  required: true,
}

const userSchema = {
  email,
  password,
  username,
}

userSchema.pre('save', next => {
  this.email = this.email.toLowerCase()
  this.username = this.username.toLowerCase()
  this.password = generateHash(this.password)
  next()
})

module.exports = mongoose.model('User', userSchema)
