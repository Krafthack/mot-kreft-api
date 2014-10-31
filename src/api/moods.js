var express = require('express');
var pg = require('pg');
var Mood = require('../models/mood');
var app = express();

app.get('/moods', function(req, res) {
  var mood = new Mood(app.get('databaseString'));

  var userId = req.session.user.id;

  var success = function(result) {
    return res.json({ success: true, data: result.rows })
  }

  var error = function(err) {
    return res.status(500).json( {success: false, error: err});
  }

  mood.all(userId, error, success);
});

app.post('/moods', function(req, res) {
  var mood = new Mood(app.get('databaseString'));
  var data = req.body;
  var id = req.session.user.id;

  var error = function(err) {
    return res.status(500).json( {success: false, error: err});
  }
  
  mood.create(id, data, error, function() {
    return res.json({ success: true })
  });

});

module.exports = app;
