var pg = require('pg');
var express = require('express');
var app = express();

app.get('/days', function(req, res) {
  var conString = app.get('databaseString');
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return res.status(500).json(
        { success: false, error: 'Could not connect to the database'});
    }
    var userId = req.session.user.id;
      client.query(
        'select days.id as days_id, days.user_id, day, day_type, ts as hugs_ts, from_name as hug_from from days left outer join hugs on (hugs.ts < days.day and (days.day-1) < hugs.ts) where days.user_id = $1::int',
        [userId] ,function(err, result) {
      done();

      if(err) {
        return res.status(500).json( {success: false, error: err});
      }

      var group = result.rows.reduce(function(pre, cur) {
        var key = cur.day;
        if (pre[key] == null) { pre[key] = []; }
        pre[key].push(cur)
        return pre;
      }, {})

      var data = Object.keys(group).map(function(key) {
        var hugs = group[key].filter(function(hug) {
          return hug.hugs_ts != null;
        }).map(function(hug) {
          return {
            hugs_ts: hug.hugs_ts,
            hg_from: hug.hug_from
          }
        });
        return {
          day: group[key][0].day,
          days_id: group[key][0].days_id,
          hugs: hugs
        }
      });

      return res.json({ success: true, data: data })
    });
  });
});



module.exports = app;
