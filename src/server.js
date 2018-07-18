var http = require('http');
var uri = require('./_uri');

var server = http.createServer(function(req, res) {
  var params = querystring.parse(url.parse(req.url).query);
  var smth = new Query().eq("foo", "bar");
  console.log(uri);
  console.log(smth.args);
  res.writeHead(200, {
    "Content-Type": "text/plain"
  });
  if ('firstname' in params && 'lastname' in params) {
    res.write('Your name is ' + params.firstname + ' ' + params.lastname);
  } else {
    res.write('You do have a first name and a last name, don\'t you?');
  }
  res.end();
});
server.listen(8081);
