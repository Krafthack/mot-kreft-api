var pg = require('../src/lib/q-pg');

var connString = process.env.DATABASE_URL;

var users = [
  { name: 'Ken Bjerke', id: 1 },
  { name: 'Frode Møst', id: 2 },
  { name: 'Pål Grønnbeck', id: 3}];

var caretakers = ['Cathinka Hinkel', 'Unni Sandstrand', 'Eivind Walberg'];

var flatten = function(a,b) {
  return a.concat(b);
};

var populate = {
  users: function(pgClient, users) {
    var users = users.map(function(user) {
      return "insert into users (id, name) values ("+user.id+", '"+ user.name +"')"
    }).join(';')

    console.log(users)

    return pgClient.query(users)
    .then(function(results) {
      console.log('Successfully populated the db with users\n');
    }, function(err) {
      console.log('Failed to populate db with users: ' + err + '\n');
    })
  }
}

pg.connect(connString).then(function(pgClient) {
  populate.users(pgClient, users).finally(function() {
    pgClient.close();
  });
})

pg.connect(connString).then(function(pgClient) {

  var queries = users
  .map(function(user) {
    var arr = [];
    for (var i = 0; i < 15; i++) {
      arr.push(user);
    }
    return arr;
  })
  .reduce(flatten)
  .map(function(user) {
    var feel = Math.floor(Math.random() * 3);
    var location = Math.floor(Math.random() * 2) == 0 ? 'Home' : 'Hospital';

    return "insert into moods(user_id, ts, comment, location, feel) " +
    "values (" + user.id + ", NOW(), 'Hello', '"+location+"', "+feel+")";

  }).join(';')

  pgClient.query(queries)
  .then(function() {
    console.log('Successfully populated db with moods');
  }, function(err) {
      console.log('Query failed: '+ queries);
      console.log(err);
      console.log('\n');
  }).finally(function() {
    pgClient.close();
  });
})
