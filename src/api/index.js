var express = require('express');
var usersApi = require('./users');
var moodsApi = require('./moods');
var app = express();

app.use(moodsApi);
app.use(usersApi);

app.get('/', function(req, res) {
  res.json({ success: true, message: 'Welcome'})
});


module.exports = app;
