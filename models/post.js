const mongoose = require('mongoose')
const User = require('./user')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const postSchema = new Schema({
  user: { type: ObjectId, ref: 'User' },
  title: {
    type: String,
    required () {
      return this.post_type === 'question'
    }
  },
  content: String,
  isSolved: { type: Boolean, default: false },
  totLikes: {
    type: Number,
    default: 0
  },
  postType: {
    type: String,
    enum: [ 'question', 'answer' ]
  },
  tags: [{ type: String }],
  answers: [{ type: ObjectId, ref: 'Post' }] // or /* [this] */ which will work
}, { timestamps: true })

postSchema.statics.addQuestionAndUpdateUser = async function (question, userId) {
  try {
    let newQuestion = await this.create(question)
    let userUpdate = await User.findByIdAndUpdate(
      userId,
      { $push: { posts: newQuestion._id }},
      { new: true }
    )
    console.log('----------new question------------');
    console.log(newQuestion);
    console.log('-----------user update-------------');
    console.log(userUpdate);
    let success = {
      status: 200,
      message: 'new question added',
      data: newQuestion
    }
    return success
  } catch (error) {
    console.log('-------------new question error----------');
    console.log(error);
    let newError = {
      status: 500,
      message: 'something\'s wrong when updating your data',
      error
    }
    return newError
  }
}

postSchema.statics.voteQuestion = async function (voteMethod, postId, userId) {
  try {
    let isVoted = await User.findByIdAndCheckIdVoted(userId, postId, voteMethod)
    
    console.log('--------------is voted at post----------------');
    console.log(isVoted);
    if (isVoted) {
      let newError = {
        status: 400,
        message: `This user already ${voteMethod}voted this post`
      }
      
      throw newError
    }
  
    let post = await this.findById(postId)
    if (voteMethod === 'up') {
      post.totLikes++  
    } else {
      post.totLikes--
    }
    let saved = await post.save()
    let success = {
      status: 200,
      message: 'Database updated',
      post: saved
    }
    return success
  } catch (error) {
    if (error.message) {
      throw error
    }
    let newError = {
      status: 500,
      message: 'database connection error',
      error
    }
    return newError
  }
}

module.exports = mongoose.model('Post', postSchema)