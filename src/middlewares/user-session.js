var User = require('../models/user');
var pg = require('pg');

module.exports = function(app) {
  app.use(function(req, res, next) {
    var conString = app.get('databaseString');
    if (req.session.user != null) {
      return next();
    }

    pg.connect(conString, function(err, client, done) {
      if(err) {
        return res.status(500).json(
          { success: false, error: 'Could not connect to the database'});
      }
      client.query('SELECT * FROM users where id = 1', function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          return res.status(500).json(
            { success: false, error: 'Could not connect to the database'});
        }
        var user = result.rows[0];
        req.session.user = new User(user.id, user.name);
        next();
      });
    });
  });
}
