const router = require('express').Router()

const {
  addNewQuestion,
  fetchAllQuestions,
  fetchQuestionById,
  votePostById
} = require('../controllers/questions.controller')

const auth = require('../middlewares/auth')

// GET

router
  .get('/', fetchAllQuestions)
  .get('/:qusId', fetchQuestionById)

// POST

router
  .post('/add', auth, addNewQuestion)

// PUT

router
  .put('/:qusId/vote', auth, votePostById)

module.exports = router