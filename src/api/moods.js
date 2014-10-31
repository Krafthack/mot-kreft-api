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
      done();

      if(err) {
        return res.status(500).json( {success: false, error: err});
      }
      return res.json({ success: true, data: result.rows })
    });
  });
});

app.post('/moods', function(req, res) {
  var conString = app.get('databaseString');
  var data = req.body;
  var id = req.session.user.id;

  if (data.feel == null) {
    return res.json({ success: false, error: 'Wrong data format, feel::int is required' })
  }

  if (data.feel < 0 && data.feel > 100) {
    return res.json({ success: false, error: 'Feel must be between 0 and 100.' })
  }

  pg.connect(conString, function(err, client, done) {
    if(err) {
      return res.status(500).json(
        { success: false, error: 'Could not connect to the database'});
    }
    var userId = req.session.user.id;
    var query = 'insert into moods (user_id, ts, comment, location, feel) ' +
    'values($1, NOW(), $2, $3, $4)';

    client.query(query,
      [id, data.comment || '', data.location || '', data.feel],
      function(err, result) {

      done();

      if(err) {
        return res.status(500).json( {success: false, error: err});
      }
      return res.json({ success: true })
    });
  });
});

module.exports = app;
