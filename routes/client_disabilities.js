var express = require('express');
var router = express.Router();
const path = require('path');
const moment = require('moment');
var HttpStatus = require('http-status-codes');

/* GET clientdisabilities listing. */
router.get('/', (req, res, next) => {
  var db = req.app.get('db');
  db.clientdisability.find(req.query, function(err, clientdisabilities){
    return res.json(clientdisabilities);
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.clientdisability.find(id, function(err, clientdisability){
    if (clientdisability) {
      return res.json(clientdisability);
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({});
    }
  });
});

router.post('/', (req, res, next) => {
  var db = req.app.get('db');
  var clientdisability = req.body;
  clientdisability.creation_date = new Date();
  clientdisability.last_update_date = new Date();
  clientdisability.notedbyuserid = 1;
  db.clientdisability.insert(req.body, function(err, clientdisability){
    return res.status(HttpStatus.CREATED).json(clientdisability);
  });
});

router.put('/:id', (req, res, next) => {
  var db = req.app.get('db');
  var clientdisability = req.body;
  clientdisability.last_update_date = new Date();
  clientdisability.id = Number(req.params.id);
  db.clientdisability.save(clientdisability, function(err, clientdisability){
    return res.status(HttpStatus.OK).json(clientdisability);
  });
});

router.delete('/:id', (req, res, next) => {
  const results = [];
  var db = req.app.get('db');
  db.clientdisability.destroy({id: Number(req.params.id)}, function(err, clientdisability){
      return res.status(HttpStatus.NO_CONTENT).json(clientdisability);
  });
});

module.exports = router;
