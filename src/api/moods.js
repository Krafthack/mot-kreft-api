var express = require('express');
var pg = require('../lib/q-pg');
var app = express();

app.get('/moods', function(req, res) {
  var conString = app.get('databaseString');
  pg.connect(conString).then(function(pgclient) {
    pgclient.query('SELECT * FROM moods', function(err, results) {
      if (err) {
        return res.status(500).json( {success: false, error: err} )
      }
      return res.json({ success: true, moods: results.rows })
    })
  }, function(err) {
    return res.status(500).json(
      { success: false, error: 'Could not connect to the database'});
  });
});

app.post('/moods', function(req, res) {
  res.json({ success: false, error: 'Not implemented' })
});

module.exports = app;
