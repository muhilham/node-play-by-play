var _ = require('lodash');
var Cat = require('../models/cat');

function Cats(app){
  _cats = [];

  /*Route*/
  app.post('/cat', createCat);
  app.get('/cat', readCats);
  app.get('/cat/:id', readCatId);
  app.put('/cat/:id', updateCat);
  app.delete('/cat/:id', deleteCat);

  /* Create */
  function createCat(req, res){
    var newCat = new Cat(req.body);
    newCat.save(function(err){
      _errHandle(err, res, 'error during cat create');
      res.json({ info: 'Cat Created Successfully' });
    });
  }

  /* Read */
  function readCats(req, res){
    Cat.find(function(err, cats){
      _errHandle(err, res, 'error during find cats');
      res.json({
        info: 'Cats found Successfully',
        data: cats
      });
    });
  }

  function readCatId(req, res) {
    Cat.findById(req.params.id, function(err, cats) {
      _errHandle(err, res, 'error during find cats');

      var data = (cat) ? {
        info: 'Cat found Successfully',
        data: cats
      } : {
        info: 'Cat Not Found'
      };

      res.json(data);
    });
  }

  /* Update */
  function updateCat(req, res){
    Cat.findById(req.params.id, function(err, cat) {
      _errHandle(err, res, 'error during find cats');

      if (cat) {
        _.merge(cat, req.body);

        cat.save(function(err) {
          _errHandle(err, res, 'error during cat update');
          res.json({ info: 'Cat Updated Successfully' });
        });
      } else {
        res.json({info: 'Cat Not Found'});
      }

    });
  }

  function deleteCat(req, res){
    Cat.findByIdAndRemove(req.params.id, function(err) {
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

module.exports = Cats;