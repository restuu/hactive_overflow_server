const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const userSchema = new Schema({
  fullname: String,
  email: {
    type: String,
    validate: {
      validator (v) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(v)
      },
      message: '{VALUE} is not a valid email'
    },
    unique: true
  },
  password: String,
  posts: [{type: ObjectId, ref: 'Post'}],
  likes: [{type: ObjectId, ref: 'Post'}]
})

module.exports = mongoose.model('User', userSchema)