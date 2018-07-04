const Post = require('../models/post')

module.exports = {
  addNewQuestion (req, res) {
    let user = res.locals.user
    let postType = 'question'
    let { title, content, tags } = req.body
    let question = { title, content, tags, postType }
    Post.addQuestionAndUpdateUser(question, user.id)
      .then(result => {
        res.status(result.status).json({
          message: result.message,
          data: result.data
        })
      })
    .catch(err => {
      res.status(err.status).json({
        message: err.message,
        error: err.error
      })
    })
  },

  fetchAllQuestions (req, res) {
    Post
      .find()
      .then(questions => {
        res.status(200).json({
          message: 'data loaded',
          questions
        })
      })
    .catch(err => {
      res.status(500).json({
        message: 'loading data error',
        error: err.message 
      })
    })
  },

  fetchQuestionById (req, res) {
    let qusId = req.params.qusId
    Post
      .findById(qusId)
      .then(result => {
        res.status(200).json({
          message: 'data loaded',
          question: result
        })
      })
    .catch(err => {
      res.status(500).json({
        message: 'loading data error',
        error: err.message
      })
    })
  },

  votePostById (req, res) {
    let qusId = req.params.qusId
    let voteMethod = req.query.q
    let user = res.locals.user

    if (voteMethod !== 'up' && voteMethod !== 'down') {
      return res.status(400).json({
        message: `method "${voteMethod}" is unrecognized`
      })
    }

    Post
      .voteQuestion(voteMethod, qusId, user.id)
      .then(result => {
        console.log('-----------vote success---------------');
        console.log(result);
        res.status(result.status).json({
          message: result.message,
        })
      })
      .catch(err => {
        if (err.status) {
          res.status(err.status).json({
            message: err.message
          })
        }
      })
  },

  getPermission(req, res) {
    let userId = res.locals.user.id
    let postId = req.params.qusId
    
    Post.findById
  }
}