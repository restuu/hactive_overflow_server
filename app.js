require('dotenv').config()
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')

// connect mlab
const mongoUser = process.env.MONGO_USER
const mongoPass = process.env.MONGO_PASS
const dbName = process.env.DB_NAME
mongoose.connect(`mongodb://${mongoUser}:${mongoPass}@ds119028.mlab.com:19028/overflow_db`)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'db conection error'))
db.once('open', () => console.log('connected to db'))

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
// const questionsRouter = require('./routes/questions')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
