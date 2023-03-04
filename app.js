const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);

module.exports = app;

if (require.main === module) {
    require('./bin/www')
}