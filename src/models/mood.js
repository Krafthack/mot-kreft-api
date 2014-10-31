var pg = require('pg');

function Mood(conStr) {
  this.conStr = conStr
}

var all = function(userId, error, success) {
  pg.connect(this.conString, function(err, client, done) {
    if(err) {
      return error('Could not connect to the database')
    }
    client.query('SELECT * FROM moods where user_id = $1::int', [userId], function(err, result) {
      done();

      if(err) {
        error(err)
      }
      return success(result)
    });
  });
}

var create = function(id, data, error, success) {
  pg.connect(this.conString, function(err, client, done) {
    if(err) {
      return error('Could not connect to the database');
    }
    var query = 'insert into moods (user_id, ts, comment, location, feel) ' +
    'values($1, NOW(), $2, $3, $4)';

    client.query(query,
      [id, data.comment || '', data.location || '', data.feel],
      function(err, result) {

      done();

      if(err) {
        error(err)
      }
      success()
    });
  });
}

Mood.prototype.all = all;
Mood.prototype.create = create;

module.exports = Mood;
