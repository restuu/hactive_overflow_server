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
    question.user = userId
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
    throw newError
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
    if (error.status) {
      throw error
    }
    let newError = {
      status: 500,
      message: 'database connection error',
      error
    }
    throw newError
  }
}

postSchema.statics.addAnswerToQuestion = async function (answer, qusId, userId) {
  try {
    let newAnswer = await this.create(answer)
    let question = await this.findById(qusId)
    let user = await User.findById(userId)
    
    user.posts.push(newAnswer._id)

    let userUpdated = await user.save()
    console.log('----------user answered----------');
    console.log(userUpdated);

    question.answers.push(newAnswer._id)

    let questionUpdated = await question.save()
    console.log('------------new answer------------');
    console.log(questionUpdated)
    
    let success = {
      status: 200,
      message: 'new answer added'
    }

    return success
  } catch (error) {

    console.log('---------------error at adding answer post model-------------');
    console.log(error);

    if (error.status) {
      throw error
    }
    let newError = {
      status: 500,
      message: 'database connection failed',
      error
    }

    throw newError
  }
}

module.exports = mongoose.model('Post', postSchema)