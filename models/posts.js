const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const postSchema = new Schema({
  user: {type: ObjectId, ref: 'User'},
  title: {
    type: String,
    required () {
      return this.post_type === 'question'
    }
  },
  content: String,
  isSolved: { type: Boolean, default: false },
  tot_likes: Number,
  post_type: {
    type: String,
    enum: ['question', 'answer']
  },
  answers: [{ type: ObjectId, ref: 'Post' }] // or /* [this] */ which will work
}, { timestamps: true })

module.exports = mongoose.model('Post', postSchema)