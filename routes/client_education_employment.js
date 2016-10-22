var express = require('express');
var router = express.Router({mergeParams: true});
const path = require('path');
const moment = require('moment');
var HttpStatus = require('http-status-codes');


/* GET clienteducationemployments listing. */
router.get('/', (req, res, next) => {
  var db = req.app.get('db');
  var queryParams = req.query;
  queryParams['clientid'] = req.params.clientId;  
  db.clienteducationemployment.find(queryParams, function(err, clienteducationemployments){
    return res.json(clienteducationemployments);
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var queryParams = req.query;
  queryParams['clientid'] = req.params.clientId;
  queryParams['id'] = req.params.id;
  var db = req.app.get('db');
  db.clienteducationemployment.findOne(queryParams, function(err, clienteducationemployment){
    if (clienteducationemployment) {
      return res.json(clienteducationemployment);
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({});
    }
  });
});

router.post('/', (req, res, next) => {
  var db = req.app.get('db');
  var clienteducationemployment = req.body;
  clientdisabilitiy.clientid = req.params.clientId;  
  clienteducationemployment.creation_date = new Date();
  clienteducationemployment.last_update_date = new Date();
  clienteducationemployment.notedbyuserid = 1;
  db.clienteducationemployment.insert(req.body, function(err, clienteducationemployment){
    return res.status(HttpStatus.CREATED).json(clienteducationemployment);
  });
});

router.put('/:id', (req, res, next) => {
  var db = req.app.get('db');
  var clienteducationemployment = req.body;
  clienteducationemployment.last_update_date = new Date();
  clienteducationemployment.id = Number(req.params.id);
  db.clienteducationemployment.save(clienteducationemployment, function(err, clienteducationemployment){
    return res.status(HttpStatus.OK).json(clienteducationemployment);
  });
});

router.delete('/:id', (req, res, next) => {
  const results = [];
  var db = req.app.get('db');
  db.clienteducationemployment.destroy({id: Number(req.params.id)}, function(err, clienteducationemployment){
      return res.status(HttpStatus.NO_CONTENT).json(clienteducationemployment);
  });
});

module.exports = router;
