var db = require('../models/db');
var app = require('express')()

app.get('/hugs', function (req, res) {
  var userId = req.session.user.id;

  var success = function(result) {
    return res.json({ success: true, data: result.rows })
  }

  var error = function(err) {
    return res.status(500).json( {success: false, error: err});
  }

  var args = {
    conStr: app.get('databaseString'),
    query: 'SELECT * FROM hugs where user_id = $1::int',
    params: [userId],
    error: error,
    success: success
  }
  db(args);

});

app.post('/hugs', function (req, res) {
  var data = req.body;

  var success = function(result) {
    return res.json({ success: true })
  }

  var error = function(err) {
    return res.status(500).json( {success: false, error: err});
  }

  if (data.id == null || data.from == null) {
    return error('Remember to specify id::int and from::string');
  }

  db({
    conStr: app.get('databaseString'),
    query: 'insert into hugs (ts, user_id, from_name) values (NOW(), $1, $2)',
    params: [data.id, data.from],
    error: error,
    success: success
  })
});

module.exports = app;
