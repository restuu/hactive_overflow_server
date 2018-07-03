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
  }
}