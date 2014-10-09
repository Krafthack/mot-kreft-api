var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var configure = require('./src/config/app-config');
var enableCors = require('./src/middlewares/enable-cors');
var usersApi = require('./src/api/users');
var moodsApi = require('./src/api/moods');
var app = express();

configure(app);

app.use(bodyParser.json());
app.use(session( {
  secret: app.get('sessionKey')
}));

app.all('*', enableCors);

app.use(moodsApi);
app.use(usersApi);

app.get('/', function(req, res) {
  res.json({ success: true, message: 'Welcome'})
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
