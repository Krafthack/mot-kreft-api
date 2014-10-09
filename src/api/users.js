var express = require('express');
var dummies = require('../mocks/dummy');
var app = express();

app.all('*', dummies.dummyUser);

app.post('/users', function(req, res) {
  res.json({ success: false, error: 'Not implemented' })
});

app.get('/users/me', function(req,res) {
  console.log(req.session)
  res.json(req.session.user)
})

module.exports = app;
