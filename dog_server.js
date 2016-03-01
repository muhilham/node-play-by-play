var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb://localhost/dogs');
var port = 3003;
var ip = '127.0.0.1';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var dogs = require('./routes/dogs')(app);

var server = app.listen(port, function() {
  console.log('Server Running at http://'+ ip + ':'+ port + '/');
});