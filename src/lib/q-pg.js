var Q = require('Q');
var pg = require('pg');

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
          return deferred.resolve(client);
        }
      })
      return deferred.promise;
    }
  }
}

module.exports = Qpg()
