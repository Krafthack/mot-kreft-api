
module.exports = function(app) {
  app.set('port', (process.env.PORT || 5000))
  app.set('databaseString', process.env.DATABASE_URL)
  app.set('sessionKey', process.env.SESSION_KEY || '1234567890 dev key');
}
