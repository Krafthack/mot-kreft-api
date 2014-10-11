var express = require('express');
var configure = require('./src/config/app-config');
var api = require('./src/api');
var dummies = require('./src/mocks/dummy');
var pg = require('./src/lib/q-pg');
var app = express();

configure(app);
app.use(api);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});
