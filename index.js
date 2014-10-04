var express = require('express')
var pg = require('./src/lib/q-pg.js');
var app = express();

app.set('port', (process.env.PORT || 5000))
app.set('databaseString', process.env.DATABASE_URL)

var conString = app.get('databaseString');

app.all('*', function(req, res, next){
  if (!req.get('Origin')) return next();
  // use "*" here to accept any origin
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, PUT, GET');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  // res.set('Access-Control-Allow-Max-Age', 3600);
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

pg.connect(conString).then(function(pgclient) {
  console.log('Connected to psql');

  app.get('/', function(req, res) {
    res.json({ success: true, message: 'Welcome'})
  });

  app.get('/moods', function(req, res) {
    pgclient.query('SELECT * FROM moods', function(err, results) {
      if (err) {
        return res.status(500).json( {success: false, error: err} )
      }
      return res.json({ success: true, moods: results.rows })
    })
  });

  app.post('/moods', function(req, res) {
    res.json({ success: false, error: 'Not implemented' })
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
