var db = require('./db');

function Mood(conStr) {
  this.conStr = conStr
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
