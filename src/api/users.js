var express = require('express');
var dummies = require('../mocks/dummy');
var pg = require('../lib/q-pg');
var User = require('../models/user');
var app = express();

var conString = app.get('databaseString');
var findUser = function(setUser) {
    pg.connect(conString).then(function(pgclient) {
      return pgclient.query('select * from users where id = 1');
    }).then(function(results) {
      var user = results.rows[0];
      return new User(user.name.replace(' ', '-'), user.name)
    }).then(function(user) {
      setUser(user)
    }).catch(function(err) {
      console.log(err)
    })
}

app.all('*', dummies.dummyUser(findUser));

app.post('/users', function(req, res) {
  res.json({ success: false, error: 'Not implemented' })
});

app.get('/users/me', function(req,res) {
  console.log(req.session)
  res.json(req.session.user)
})

module.exports = app;
