var pg = require('../src/lib/q-pg');

var connString = process.env.DATABASE_URL;
pg.connect(connString).then(function(pgClient) {
  var query = "insert into users (name) values ('Ken Bjerke');" +
  "insert into users (name) values ('Frode Møst');" +
  "insert into users (name) values ('Pål Grønnbeck');"

  pgClient.query(query)
  .then(function(results) {
    console.log('Successfully populated the db with users');
  }, function(err) {
    console.log('Failed to populate db with users');
  })

  pgClient.close();
})
