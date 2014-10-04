var sh = require('sh');
var Q = require('Q');

function exists(cmd) {
  var deferred = Q.defer();
  sh('which ' + cmd).result(function(exist) {
    if (exist == '') {
      console.error('Command not found: ' + cmd)
      deferred.reject(false);
    }
    else {
      deferred.resolve(true);
    }
  });
  return deferred.promise;
}

function exitIfFails(promise) {
  return promise.then(
    function(pipeit) {
      return pipeit;
    },
    function() {
      process.exit(1);
    }
  )
}

exitIfFails(exists('dropdb'))
.then(function() {
    return exitIfFails(exists('createdb'));
})
.then(function() {
  return exitIfFails(exists('psql'));
})
.then(function() {
  return sh('createuser -r -s --password dev_krafthack');
})
.then(function(prev) {
  var deferred = Q.defer();
  sh('psql -l')('grep "krefthack"')('wc -l').result(function(res) {
    deferred.resolve(res);
  });
  return deferred.promise;
})
.then(function(prev) {
  var exists = prev.trim() == '1';
  if (exists) {
      return sh('dropdb krefthack');
  } else {
    return null;
  }
})
.then(function(exists) {
  if (exists == null) {
    return sh('createdb krefthack');
  } else {
    return null;
  }
})
.then(function(prev) {
  if (prev == null) {
    return sh('cat model.sql')('psql --username=dev_krafthack krefthack');
  } else {
    return prev.and('cat model.sql')('psql --username=dev_krafthack krefthack');
  }

})
.catch(function(err) {
  console.log('all the crashes', err)
})
