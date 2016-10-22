var express = require('express');
var router = express.Router({mergeParams: true});
const path = require('path');
const moment = require('moment');
var HttpStatus = require('http-status-codes');
var _ = require('lodash');

function addHref(programClient) {
  if (programClient) {
    programClient['client_href'] = '/clients/' + programClient.client_id;
  }
  return programClient;
}

function mod(programClients) {
  if (Array.isArray(programClients)) {
    _.forEach(programClients, function(programClient) {
      addHref(programClient);
    });
  } else {
    addHref(programClients);
  }
  return programClients || {};
}

router.get('/', (req, res, next) => {
  // return res.json(req.params);
  var db = req.app.get('db');
  var queryParams = req.query;
  queryParams['agency_id'] = req.params.agency_id;
  queryParams['program_id'] = req.params.program_id;
  db.enrollment.find(queryParams, function(err, enrollment){
    if (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.json(mod(enrollment));
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.enrollment.find({"id": id}, function(err, programClients){
    if (programClients) {
      return res.json(programClients);
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({});
    }
  });
});

router.post('/', (req, res, next) => {
  var db = req.app.get('db');
  var programClient = req.body;
  programClient['agency_id'] = req.params.agency_id;
  programClient['program_id'] = req.params.program_id;
  programClient.creation_date = new Date();
  programClient.last_update_date = new Date();
  db.enrollment.insert(programClient, function(err, programClient){
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(HttpStatus.CREATED).json(mod(programClient));
  });
});

router.put('/:id', (req, res, next) => {
  var db = req.app.get('db');
  var programClient = req.body;
  programClient.last_update_date = new Date();
  programClient.id = Number(req.params.id);
  db.enrollment.save(programClient, function(err, programClient){
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(HttpStatus.OK).json(mod(programClient));
  });
});

router.delete('/:id', (req, res, next) => {
  const results = [];
  var db = req.app.get('db');
  db.enrollment.destroy({id: Number(req.params.id)}, function(err, programClient){
      return res.status(HttpStatus.NO_CONTENT).json(programClient);
  });
});

module.exports = router;
