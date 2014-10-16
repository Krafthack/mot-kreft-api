var pg = require('../src/lib/q-pg');

var connString = process.env.DATABASE_URL;
pg.connect(connString).then(function(pgClient) {
  var query = "insert into users (name) values ('Ken Bjerke');" +
  "insert into users (name) values ('Frode Møst');" +
  "insert into users (name) values ('Pål Grønnbeck');"

  pgClient.query(query, function(err, results) {
    if (err) { console.log('Failed to populate db with users'); }
    else { console.log('Successfully populated the db with users'); }
  })
})
