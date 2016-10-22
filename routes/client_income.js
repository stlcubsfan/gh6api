var express = require('express');
var router = express.Router({mergeParams: true});
const path = require('path');
const moment = require('moment');
var HttpStatus = require('http-status-codes');


/* GET clientincomes listing. */
router.get('/', (req, res, next) => {
  var db = req.app.get('db');
  var queryParams = req.query;
  queryParams['clientid'] = req.params.clientId;  
  db.clientincome.find(queryParams, function(err, clientincomes){
    return res.json(clientincomes);
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var queryParams = req.query;
  queryParams['clientid'] = req.params.clientId;
  queryParams['id'] = req.params.id;
  var db = req.app.get('db');
  db.clientincome.findOne(queryParams, function(err, clientincome){
    if (clientincome) {
      return res.json(clientincome);
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({});
    }
  });
});

router.post('/', (req, res, next) => {
  var db = req.app.get('db');
  var clientincome = req.body;
  clientdisabilitiy.clientid = req.params.clientId;  
  clientincome.creation_date = new Date();
  clientincome.last_update_date = new Date();
  clientincome.notedbyuserid = 1;
  db.clientincome.insert(req.body, function(err, clientincome){
    return res.status(HttpStatus.CREATED).json(clientincome);
  });
});

router.put('/:id', (req, res, next) => {
  var db = req.app.get('db');
  var clientincome = req.body;
  clientincome.last_update_date = new Date();
  clientincome.id = Number(req.params.id);
  db.clientincome.save(clientincome, function(err, clientincome){
    return res.status(HttpStatus.OK).json(clientincome);
  });
});

router.delete('/:id', (req, res, next) => {
  const results = [];
  var db = req.app.get('db');
  db.clientincome.destroy({id: Number(req.params.id)}, function(err, clientincome){
      return res.status(HttpStatus.NO_CONTENT).json(clientincome);
  });
});

module.exports = router;
