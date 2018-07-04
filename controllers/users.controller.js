const User = require('../models/user')
const jwt = require('jsonwebtoken')

module.exports = {
  addNewUser ( req, res ) {
    let { fullname, email, password } = req.body
    let user = { fullname, email, password }
    User
      .findOneOrCreate(user)
      .then(result => {
        res.status(result.status).json({
          message: result.message
        })
      })
    .catch(err => {
      res.status(err.status).json({
        message: err.message
      })
    })
  },

  findUser (req, res) {
    let { email, password } = req.body
    let candidate = { email, password }
    
    User
      .findByEmailThenComparePass(candidate)
      .then(result => {
        let secretKey = process.env.JWT_SECRET
        let payload = {
          id: result.user._id,
          email: result.user.email
        }

        let token = jwt.sign(payload, secretKey)

        res.status(result.status).json({
          message: result.message,
          user: result.user.fullname,
          token
        })
      })
    .catch(err => {
      console.log(err)
      res.status(err.status).json({
        message: err.message
      })
    })
  }
}