const router = require('express').Router()

const {
  addNewQuestion,
  fetchAllQuestions
} = require('../controllers/questions.controller')

const auth = require('../middlewares/auth')
// GET
router
  .get('/')

// POST

router
  .post('/add', auth, addNewQuestion)

module.exports = router