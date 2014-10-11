var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var configure = require('./src/config/app-config');
var enableCors = require('./src/middlewares/enable-cors');
var api = require('./src/api');
var dummies = require('./src/mocks/dummy');
var pg = require('./src/lib/q-pg');
var app = express();

configure(app);

app.use(bodyParser.json());
app.use(session( {
  secret: app.get('sessionKey')
}));

app.all('*', enableCors);

app.use(api);

app.get('/', function(req, res) {
  res.json({ success: true, message: 'Welcome'})
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
