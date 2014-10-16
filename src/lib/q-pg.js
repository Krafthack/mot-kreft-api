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
        done();
        pgclient.end()
        return deferred.resolve(results)
      }
    })

    return deferred.promise;
  }

  this.close = function() {
    pgclient.end();
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
    }
  }
}

module.exports = Qpg()
