const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET

function auth (req, res, next) {
  let token = req.headers.authorization
  try {
    let decoded = jwt.verify( token, secretKey )
    console.log('---------------jwt decoded----------------')
    console.log(decoded)
    res.locals.user = decoded
    next()
  } catch (error) {
    console.log('--------------jwt error-----------------')
    res.status(401).json({
      message: 'user authentication failed',
      error
    })
  }
}

module.exports = auth