var express = require('express');
var usersApi = require('./users');
var moodsApi = require('./moods');
var app = express();

app.use(moodsApi);
app.use(usersApi);

module.exports = app;
