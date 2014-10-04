var express = require('express')
var app = express();

app.set('port', (process.env.PORT || 5000))

app.get('/', function(req, res) {
  res.json({ success: true })
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
