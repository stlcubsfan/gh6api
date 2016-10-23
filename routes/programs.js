var express = require('express');
var router = express.Router({mergeParams: true});
const path = require('path');
const moment = require('moment');
var HttpStatus = require('http-status-codes');
var _ = require('lodash');
var programClients = require('./program_clients')

router.use('/:program_id/clients', programClients);

function addHref(program) {
  if (program) {
    program['clients_href'] = '/agencies/' + program.agency_id + '/programs/'+ program.id + '/clients';
  }
  return program;
}

function mod(programs) {
  if (Array.isArray(programs)) {
    _.forEach(programs, function(program) {
      addHref(program);
    });
  } else {
    addHref(programs);
  }
  return programs || {};
}

router.get('/', (req, res, next) => {
  var db = req.app.get('db');
  var queryParams = req.query;
  queryParams['agency_id'] = req.params.agency_id;
  db.programv.find(queryParams, function(err, programs){
    return res.json(mod(programs));
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.programv.findOne({"id": id}, function(err, program){
    if (program) {
      return res.json(program);
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({});
    }
  });
});

router.post('/', (req, res, next) => {
  var db = req.app.get('db');
  var program = req.body;
  program['agency_id'] = req.params.agency_id;
  program.creation_date = new Date();
  program.last_update_date = new Date();
  db.program.insert(program, function(err, program){
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(HttpStatus.CREATED).json(mod(program));
  });
});

router.put('/:id', (req, res, next) => {
  var db = req.app.get('db');
  var program = req.body;
  program.last_update_date = new Date();
  program.id = Number(req.params.id);
  db.program.save(program, function(err, program){
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(HttpStatus.OK).json(mod(program));
  });
});

router.delete('/:id', (req, res, next) => {
  const results = [];
  var db = req.app.get('db');
  db.program.destroy({id: Number(req.params.id)}, function(err, program){
      return res.status(HttpStatus.NO_CONTENT).json(program);
  });
});

module.exports = router;
