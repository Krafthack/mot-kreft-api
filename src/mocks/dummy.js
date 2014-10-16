var User = require('../models/user');

var dummyUser = function(user) {
    return function (req, res, next) {
    var session = req.session;
    if (session == null) return next();
    else if (session.user == null){
      if (user instanceof User) {
        session.user = user;
        return next();
      }
      else if (typeof user == 'function') {
        user(function(user) {
          session.user = user
          next();
        });
        return;
      }
      throw new Error('Input must be of type User or function, but was of type '+ (typeof user));
    } else {
      return next();
    }
  }
}

exports.dummyUser = dummyUser;
