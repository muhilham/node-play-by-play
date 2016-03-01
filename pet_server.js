var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var port = 3005;
var ip = '127.0.0.1';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var pet = require('./routes/pets')(app);

var server = app.listen(port, function() {
  console.log('Server Running at http://'+ ip + ':'+ port + '/');
});