const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const { sqlConnect } = require('./db/connection')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var infoRouter = require('./routes/info')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/api/v1/user', usersRouter)
app.use('/api/v1/info', infoRouter)

module.exports = app;

if (require.main === module) {
    require('./bin/www')
}