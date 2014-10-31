var pg = require('pg');

function Mood(conStr) {
  this.conStr = conStr
}

var db = function(args) {

  if (args.conStr == null || args.conStr == '') {
    throw new Error('Database connection string not specified.')
  }

  pg.connect(args.conStr, function(err, client, done) {
    if(err) {
      return error('Could not connect to the database')
    }
    client.query(args.query, args.params, function(err, result) {
      done();

      if(err) {
        args.error(err)
      }
      return args.success(result)
    });
  });
}

var all = function(userId, error, success) {
  var args = {
    conStr: this.conStr,
    query: 'SELECT * FROM moods where user_id = $1::int',
    params: [userId],
    error: error,
    success: success
  }
  db(args);
}

var create = function(id, data, error, success) {
  if (data.feel == null) {
    return error('Wrong data format, feel::int is required');
  }

  if (data.feel < 0 || data.feel > 100) {
    return error('Feel must be between 0 and 100.');
  }

  db({
    conStr: this.conStr,
    query: 'insert into moods (user_id, ts, comment, location, feel) values($1, NOW(), $2, $3, $4)',
    params: [id, data.comment || '', data.location || '', data.feel],
    error: error,
    success: success
  });
}

Mood.prototype.all = all;
Mood.prototype.create = create;

module.exports = Mood;
