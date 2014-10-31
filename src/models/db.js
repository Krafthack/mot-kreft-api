var pg = require('pg');

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
        return args.error(err)
      }
      return args.success(result)
    });
  });
}

module.exports = db;
