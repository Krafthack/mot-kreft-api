var express = require('express');
var dummies = require('../mocks/dummy');
var pg = require('pg');
var User = require('../models/user');
var app = express();

app.post('/users', function(req, res) {
  res.json({ success: false, error: 'Not implemented' })
});

app.get('/users/me', function(req,res) {
  var conString = app.get('databaseString');
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return res.status(500).json(
        { success: false, error: 'Could not connect to the database'});
    }
    client.query('SELECT * FROM users where id = 1', function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        return res.status(500).json(
          { success: false, error: 'Could not connect to the database'});
      }
      var user = result.rows[0];
      req.session.user = new User(user.name.replace(' ', '-'), user.name)
      res.json({ success: true, data: req.session.user});
    });
  });
})

module.exports = app;
