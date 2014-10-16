var connString = process.env.DATABASE_URL;

var users = [
  { name: 'Ken Bjerke', id: 1 },
  { name: 'Frode Møst', id: 2 },
  { name: 'Pål Grønnbeck', id: 3}];

var cares = ['Cathinka Hinkel', 'Unni Sandstrand', 'Eivind Walberg'];

var adjustByDay = function(date, days) {
  var n = new Date();
  n.setDate(date.getDate() + days);
  return n;
}
var today = new Date();
var days = [adjustByDay(today, -1), today, adjustByDay(today, 1)]

var flatten = function(a,b) {
  return a.concat(b);
};

var multiply = function(n) {
  return function(user) {
    var arr = [];
    for (var i = 0; i < n; i++) {
      arr.push(user);
    }
    return arr;
  }
}

var usersQueries = users.map(function(user) {
  return "insert into users (id, name) values ("+user.id+", '"+ user.name +"');"
}).join('\n')

var caresQueries = cares.map(function(care) {
  return "insert into cares (id, name) values ("+care.id+", '"+ care.name +"');"
}).join('\n')

var moodsQueries = users
  .map(multiply(500))
  .reduce(flatten)
  .map(function(user) {
    var feel = Math.floor(Math.random() * 3);
    var location = Math.floor(Math.random() * 2) == 0 ? 'Home' : 'Hospital';

    var date = new Date();
    var day = date.getDate();
    date.setDate(day + Math.floor(Math.random() * 10))
    var dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +
      ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    return "insert into moods(user_id, ts, comment, location, feel) " +
    "values (" + user.id + ", '"+dateStr+"', 'Hello', '"+location+"', "+feel+");";

  }).join('\n')

var daysQueries = users
  .map(function(user) {
    return "insert into days (user_id, day, day_type) values ("+user.id+", '{day}', {day_type});";
  })
  .map(multiply(days.length))
  .map(function(arr) {
    return days.map(function(day) {
      return arr.map(function(q) {
        q = q.replace('{day}', day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate());
        q = q.replace('{day_type}', 0)
        return q;
      })
    }).reduce(flatten)
  }).reduce(flatten)
  .join('\n')

var hugsQueries = users
  .map(multiply(15))
  .reduce(flatten)
  .map(function(user) {

    var i = Math.floor(Math.random() * cares.length);
    var care = cares[i]

    return "insert into hugs(user_id, ts, from_name) " +
    "values (" + user.id + ", NOW(), '"+care+"');";

  }).join('\n')


console.log('/* Define users*/')
console.log(usersQueries);
console.log('/* Define those whom cares*/')
console.log(caresQueries);
console.log('\n/*Define moods*/')
console.log(moodsQueries);
console.log('\n/*Define days*/')
console.log(daysQueries);
console.log('\n/*All the hugs*/');
console.log(hugsQueries);
