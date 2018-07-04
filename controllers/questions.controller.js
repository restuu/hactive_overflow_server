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

  fetchPostById (req, res) {
    let qusId = req.params.qusId
    Post
      .findById(qusId)
      .populate('answers')
      .then(result => {
        res.status(200).json({
          message: 'data loaded',
          [result.postType]: result
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
    let postId = req.params.ansId || req.params.qusId
    let voteMethod = req.query.q
    let user = res.locals.user

    if (voteMethod !== 'up' && voteMethod !== 'down') {
      return res.status(400).json({
        message: `method "${voteMethod}" is unrecognized`
      })
    }

    Post
      .voteQuestion(voteMethod, postId, user.id)
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
    let postId = req.params.ansId || req.params.qusId
    
    Post
      .findById(postId)
      .then(post => {
        let owned = post.user == userId
        if (owned) {
          return res.status(200).json({
            message: 'permission granted'
          })
        }
        res.status(403).json({
          message: 'permission denied'
        })
      })
      .catch(err => {
        res.status(500).json({
          message: 'database connection failed',
          error: err
        })
      })
  },

  editPostById(req, res) {
    let postId = req.params.ansId || req.params.qusId
    let { title, content } = req.body
    Post
      .findById(postId)
      .then(result => {
        result.title = title
        result.content = content
        return result.save().then(saved => {
          res.status(200).json({
            message: 'database updated',
            post: saved
          })
        })
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: 'database connection error',
          error: err
        })
      })
  }
}