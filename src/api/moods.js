var express = require('express');
var pg = require('pg');
var app = express();

app.get('/moods', function(req, res) {
  var conString = app.get('databaseString');
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return res.status(500).json(
        { success: false, error: 'Could not connect to the database'});
    }
    var userId = req.session.user.id;
    client.query('SELECT * FROM moods where user_id = $1::int', [userId], function(err, result) {
      //call `done()` to release the client back to the pool
      done();

      if(err) {
        return res.status(500).json( {success: false, error: err});
      }
      return res.json({ success: true, data: result.rows })
      //output: 1
    });
  });
});

app.post('/moods', function(req, res) {
  res.json({ success: false, error: 'Not implemented' })
});

module.exports = app;
