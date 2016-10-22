var express = require('express');
var router = express.Router({mergeParams: true});
const path = require('path');
const moment = require('moment');
var HttpStatus = require('http-status-codes');


/* GET clienthealthes listing. */
router.get('/', (req, res, next) => {
  var db = req.app.get('db');
  var queryParams = req.query;
  queryParams['clientid'] = req.params.clientId;  
  db.clienthealth.find(queryParams, function(err, clienthealthes){
    return res.json(clienthealthes);
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var queryParams = req.query;
  queryParams['clientid'] = req.params.clientId;
  queryParams['id'] = req.params.id;
  var db = req.app.get('db');
  db.clienthealth.findOne(queryParams, function(err, clienthealth){
    if (clienthealth) {
      return res.json(clienthealth);
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({});
    }
  });
});

router.post('/', (req, res, next) => {
  var db = req.app.get('db');
  var clienthealth = req.body;
  clientdisabilitiy.clientid = req.params.clientId;  
  clienthealth.creation_date = new Date();
  clienthealth.last_update_date = new Date();
  clienthealth.notedbyuserid = 1;
  db.clienthealth.insert(req.body, function(err, clienthealth){
    return res.status(HttpStatus.CREATED).json(clienthealth);
  });
});

router.put('/:id', (req, res, next) => {
  var db = req.app.get('db');
  var clienthealth = req.body;
  clienthealth.last_update_date = new Date();
  clienthealth.id = Number(req.params.id);
  db.clienthealth.save(clienthealth, function(err, clienthealth){
    return res.status(HttpStatus.OK).json(clienthealth);
  });
});

router.delete('/:id', (req, res, next) => {
  const results = [];
  var db = req.app.get('db');
  db.clienthealth.destroy({id: Number(req.params.id)}, function(err, clienthealth){
      return res.status(HttpStatus.NO_CONTENT).json(clienthealth);
  });
});

module.exports = router;
