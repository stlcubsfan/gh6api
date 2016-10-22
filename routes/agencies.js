const express = require('express');
const router = express.Router();
const path = require('path');
var HttpStatus = require('http-status-codes');

router.post('/', (req, res, next) => {
  var db = req.app.get('db');
  db.agency.insert(req.body, function(err, item){
    return res.status(HttpStatus.CREATED).json(item);
  });
});

router.put('/:id', (req, res, next) => {
  var db = req.app.get('db');
  var agency = req.body;
  item.id = Number(req.params.id);
  db.agency.save(item, function(err, item){
    return res.status(HttpStatus.OK).json(item);
  });
});

router.get('/', (req, res, next) => {
  var db = req.app.get('db');
  db.agency.find(req.query, function(err, items){
    return res.json(items);
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.agency.find(id, function(err, item){
    var result = item || {};
    return res.json(result);
  });
});

router.delete('/:id', (req, res, next) => {
  const results = [];
  var db = req.app.get('db');
  db.items.destroy({id: Number(req.params.id)}, function(err, item){
      return res.status(HttpStatus.NO_CONTENT).json(item);
  });
});

module.exports = router;
