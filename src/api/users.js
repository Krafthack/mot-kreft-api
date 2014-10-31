var express = require('express');
var app = express();

app.post('/users', function(req, res) {
  res.json({ success: false, error: 'Not implemented' })
});

app.get('/users/me', function(req,res) {
  res.json({ success: true, data: req.session.user});
})

module.exports = app;
