var session = require('express-session');
var bodyParser = require('body-parser');
var enableCors = require('../middlewares/enable-cors');

module.exports = function(app) {
  app.set('port', (process.env.PORT || 5000))
  app.set('databaseString', process.env.DATABASE_URL)
  app.set('sessionKey', process.env.SESSION_KEY || '1234567890 dev key');
  app.use(bodyParser.json());
  app.use(session( { secret: app.get('sessionKey') }));
  app.all('*', enableCors);
}
