var Q = require('q');
var pg = require('pg');

var QClient = function(pgclient) {

  this.query = function(querystr) {
    var deferred = Q.defer();

    pgclient.query(querystr, function(err, results, done) {
      if (err) {
        return deferred.reject(['something went wrong when querying', err])
      }
      else {
        return deferred.resolve(results)
      }
    })

    this.close = function() {
      pgclient.end();
    }

    return deferred.promise;
  }

  return this;
}

function Qpg () {
  return {
    connect: function (conString) {
      var client = new pg.Client(conString);
      var deferred = Q.defer();
      client.connect(function(err) {
        if(err) {
          return deferred.reject(['could not connect to postgres:', err]);
        }
        else {
          var qClient = new QClient(client)
          return deferred.resolve(qClient);
        }
      })
      return deferred.promise;
    },
    close: function() {

    }
  }
}

module.exports = Qpg()
