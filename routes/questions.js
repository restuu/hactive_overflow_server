const router = require('express').Router()

const {
  addNewQuestion,
  fetchAllQuestions,
  fetchQuestionById,
  votePostById,
  getPermission
} = require('../controllers/questions.controller')

const auth = require('../middlewares/auth')

// GET

router
  .get('/', fetchAllQuestions)
  .get('/:qusId', fetchQuestionById)
  .get('/:qusId/edit', auth, getPermission)

// POST

router
  .post('/add', auth, addNewQuestion)

// PUT

router
  .put('/:qusId/vote', auth, votePostById)

module.exports = router