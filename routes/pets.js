var r = require('request').defaults({
    json: true
});
var async = require('async');
var redis = require('redis');

var client = redis.createClient(6379, '127.0.0.1');
module.exports = function(app) {

    var vm = this;
    /* Read */
    app.get('/pets', getPets);
    app.get('/ping', ping)
    function getPets(req, res) {

        function cat(callback) {
          vm.catCallback = callback;
          var catUri = {
            uri: 'http://127.0.0.1:3002/cat',
          }

          r(catUri, _responseCat);
        }

        function dog(callback) {
          vm.dogCallback = callback;
          vm.dogUri = {
            uri: 'http://127.0.0.1:3003/dog',
          }

          client.get(vm.dogUri.uri, cacheDog);
        }

        function cacheDog(error, dog) {
          if (error) {throw error;}
          if (dog) {
            vm.dogCallback(null, JSON.parse(dog));
          } else {
            r(vm.dogUri, _responseDog);
          }
        }

        function responseHandle(error, result) {
          /* Do Not Do any logical or manipulation things here !, it could block the entire file
            run this for proof:
            for (var i = 0; i < 20000; i++) {
              console.log(i);
            }
          */


          var payloads = {
            result: result
          };
          if (error){
            payloads.error = error;
          }
          res.json(payloads);
        }

        var parallel = {
          cat: cat,
          dog: dog
        };

        /*MAIN ACTION*/
        async.parallel(parallel, responseHandle);

        /**
         * Private Function
         */
        function _responseCat(error, response, body) {
          _response(vm.catCallback, error, response, body, 'cat', 3002);
        }

        function _responseDog(error, response, body) {
          _response(vm.dogCallback, error, response, body, 'dog', 3003);
        }

        function _response(callback, error, response, body, desc, port) {
          if (error) {
            var callbackError = {
              service: desc,
              error: error
            };
            callback(callbackError);
            return;
          }
          if (!error && response.statusCode === 200) {
            callback(null, body);
            // client.set('http://127.0.0.1:' + port + '/' + desc, JSON.stringify(body.data), setCacheErr);
            client.setex('http://127.0.0.1:' + port + '/' + desc, 10, JSON.stringify(body.data), setCacheErr);
          } else {
            callback(response.statusCode);
          }
        }
    }

    function setCacheErr(err) {
      if (err) {
        throw err;
      }
    }

    function ping(req, res) {
      res.json({pong: Date.now()});
    }
};