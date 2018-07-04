const router = require('express').Router()

const {
  addNewQuestion,
  fetchAllQuestions,
  fetchPostById,
  votePostById,
  getPermission,
  editPostById
} = require('../controllers/questions.controller')

const auth = require('../middlewares/auth')

// GET

router
  .get('/', fetchAllQuestions)
  .get('/:qusId', fetchPostById)
  .get('/:qusId/edit', auth, getPermission)

// POST

router
  .post('/add', auth, addNewQuestion)

// PUT

router
  .put('/:qusId/vote', auth, votePostById)
  .put('/:qusId/edit', auth, editPostById)

module.exports = router