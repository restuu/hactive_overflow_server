const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const userSchema = new Schema({
  fullname: String,
  email: {
    type: String,
    validate: {
      validator (v) {
        let re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
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

userSchema.statics.findOneOrCreate = async function (user) {
  let { email, password, fullname } = user

  try {
    let user = await this.findOne().where({email})
    console.log('----------schema------------',user)
    if (user) {
      let error = {
        status: 400,
        message: 'user with this email already exist'
      }
      throw error
    } else {
      let hash = bcrypt.hashSync(password, 10)
      let newUser = await this.create({
        fullname,
        email,
        password: hash
      })
      delete newUser.password
      let success = {
        status: 201,
        message: 'new user created'
      }
      return newUser
    }
  } catch (error) {
    if (error.status) {
      throw error
    }
    console.log('mongodb error', error)
    let newError = {
      status: 500,
      message: 'something\'s wrong when fetching your data'
    }
    throw newError
  }
}

userSchema.statics.findByEmailThenComparePass = async function (user) {
  let { email, password } = user
  try {
    let isFound = await this.findOne().where({ email })
    if (!isFound) {
      let error = {
        status: 400,
        message: 'user with this email doesn\'t exist'
      }
      throw error
    } else {
      let isMatch = bcrypt.compareSync(password, isFound.password)
      if (!isMatch) {
        let error = {
          status: 400,
          message: 'email and password do not match'
        }
        throw error
      }
      let foundUser = { ...isFound._doc }
      delete foundUser.password

      let success = {
        status: 200,
        message: 'user logged in',
        user: foundUser
      }
      return success
    }
  } catch (error) {
    if (error.status) {
      throw error
    }
    console.log('mongodb error', error)
    let newError = {
      status: 500,
      message: 'something\'s wrong when fetching your data'
    }
    throw newError
  }
}

module.exports = mongoose.model('User', userSchema)