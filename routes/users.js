const express = require('express')
const router = express.Router()

const {
  addNewUser,
  findUser,
} = require('../controllers/users.controller')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})

// POST

router.post('/register', addNewUser)
router.post('/login', findUser)

module.exports = router
