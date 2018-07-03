const router = require('express').Router()

const {
  addNewQuestion,
  fetchAllQuestions,
  fetchQuestionById
} = require('../controllers/questions.controller')

const auth = require('../middlewares/auth')
// GET
router
  .get('/', fetchAllQuestions)
  .get('/:qusId', fetchQuestionById)

// POST

router
  .post('/add', auth, addNewQuestion)

module.exports = router