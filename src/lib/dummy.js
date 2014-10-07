var User = require('./user');

var dummyUser = function (req, res, next) {
  var session = req.session;
  if (session == null) return next();
  else if (session.user == null){
    session.user = new User('dummy', 'Im dummy');
    return next();
  }
}

exports.dummyUser = dummyUser;
