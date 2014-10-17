var pg = require('pg');
var Q = require('q');
var _ = require('lodash');
var moment = require('moment');
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
        'select * from days where user_id = $1::int',
        [userId] ,function(err, result) {

      if(err) {
        return res.status(500).json( {success: false, error: err});
      }

      var hugs = result.rows.map(function(day) {
        var deferred = Q.defer();
        var today = moment(day.day).format('YYYY-MM-DD');
        var yester = moment(today).add(-1, 'day').format('YYYY-MM-DD');
        client.query('select * from hugs where hugs.ts < $1 and hugs.ts > $2 and user_id = $3',
        [today, yester, userId], function(err, result) {
          if (err) {
            return deferred.reject(err);
          } else {
            return deferred.resolve(result.rows);
          }
        })
        return deferred.promise;
      })

      Q.allSettled(hugs).then(function(results) {
        done();
        var hugs = results.map(function(result) {
          return result.value;
        });

        var data  = _(result.rows).zip(hugs)
        .map(function(result) {
          var day = result[0];
          day.hugs = result[1];
          return day;
        })
        .value()


        return res.json({ success: true, data: data })
      }, function() {
        console.log('something went horribly');
      })

    });
  });
});



module.exports = app;
