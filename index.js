var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var configure = require('./src/lib/app-config');
var pg = require('./src/lib/q-pg');
var app = express();

configure(app);

app.use(bodyParser.json());
app.use(session({secret: app.get('sessionKey')}));

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

app.get('/', function(req, res) {
  res.json({ success: true, message: 'Welcome'})
});

app.get('/moods', function(req, res) {
  pg.connect(conString).then(function(pgclient) {
    pgclient.query('SELECT * FROM moods', function(err, results) {
      if (err) {
        return res.status(500).json( {success: false, error: err} )
      }
      return res.json({ success: true, moods: results.rows })
    })
  });
});

app.post('/moods', function(req, res) {
  res.json({ success: false, error: 'Not implemented' })
});

app.post('/users', function(req, res) {
  res.json({ success: false, error: 'Not implemented' })
});

app.get('/users/me', function(req,res) {
  res.json({ name: 'Bruker brukersen', username: 'bruker' })
})


app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
