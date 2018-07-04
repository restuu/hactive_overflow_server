const router = require('express').Router()

const {
  addNewQuestion,
  fetchAllQuestions,
  fetchPostById,
  votePostById,
  getPermission,
  editPostById,
  addNewAnswer
} = require('../controllers/questions.controller')

const auth = require('../middlewares/auth')

// GET

router
  .get('/', fetchAllQuestions)
  .get('/:qusId', fetchPostById)
  .get('/:qusId/edit', auth, getPermission)
  .get('/:qusId/answers/:ansId', fetchPostById)

// POST

router
  .post('/add', auth, addNewQuestion)
  .post('/:qusId/answers/add', auth, addNewAnswer)

// PUT

router
  .put('/:qusId/vote', auth, votePostById)
  .put('/:qusId/edit', auth, editPostById)
  .put('/:qusId/answers/:ansId/edit', auth, editPostById)

module.exports = router