var _ = require('lodash');
var Dog = require('../models/dog');

function Dogs(app){

  /*Route*/
  app.post('/dog', createDog);
  app.get('/dog', readDogs);
  app.get('/dog/:id', readDogId);
  app.put('/dog/:id', updateDog);
  app.delete('/dog/:id', deleteDog);

  /* Create */
  function createDog(req, res){
    var newDog = new Dog(req.body);
    newDog.save(function(err){
      _errHandle(err, res, 'error during dog create');
      res.json({ info: 'Dog Created Successfully' });
    });
  }

  /* Read */
  function readDogs(req, res){
    Dog.find(function(err, dogs){
      _errHandle(err, res, 'error during find dogs');

      setTimeout(function() {
        res.json({
          info: 'dogs found Successfully',
          data: dogs
        });
      }, 10000);
    });
  }

  function readDogId(req, res) {
    Dog.findById(req.params.id, function(err, dogs) {
      _errHandle(err, res, 'error during find dogs');

      var data = (cat) ? {
        info: 'Cat found Successfully',
        data: dogs
      } : {
        info: 'Cat Not Found'
      };

      res.json(data);
    });
  }

  /* Update */
  function updateDog(req, res){
    Dog.findById(req.params.id, function(err, cat) {
      _errHandle(err, res, 'error during find dogs');

      if (cat) {
        _.merge(cat, req.body);

        Dog.save(function(err) {
          _errHandle(err, res, 'error during cat update');
          res.json({ info: 'Cat Updated Successfully' });
        });
      } else {
        res.json({info: 'Cat Not Found'});
      }

    });
  }

  function deleteDog(req, res){
    Dog.findByIdAndRemove(req.params.id, function(err) {
      _errHandle(err, res, 'error during remove cat');
      res.json({ info: 'Cat Removed Successfully' });
    });
  }

  function _errHandle(err, res, msg){
    if (err) {
      res.json({
        info: msg,
        error: err
      });
    }
  }

}

module.exports = Dogs;