var express = require('express');
var usersApi = require('./users');
var moodsApi = require('./moods');
var daysApi = require('./days');
var hugsApi = require('./hugs')

var userSession = require('../middlewares/user-session');
var app = express();

userSession(app);

app.use(moodsApi);
app.use(usersApi);
app.use(daysApi);
app.use(hugsApi);

app.get('/', function(req, res) {
  res.json({ success: true, message: 'Welcome'})
});


module.exports = app;
