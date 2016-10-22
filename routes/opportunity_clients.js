var express = require('express');
var router = express.Router({mergeParams: true});
const path = require('path');
const moment = require('moment');
var HttpStatus = require('http-status-codes');
var _ = require('lodash');

function addHref(opportunityClient) {
  if (opportunityClient) {
    opportunityClient['client_href'] = '/clients/' + opportunityClient.client_id;
  }
  return opportunityClient;
}

function mod(opportunityClients) {
  if (Array.isArray(opportunityClients)) {
    _.forEach(opportunityClients, function(opportunityClient) {
      addHref(opportunityClient);
    });
  } else {
    addHref(opportunityClients);
  }
  return opportunityClients || {};
}

router.get('/', (req, res, next) => {
  // return res.json(req.params);
  var db = req.app.get('db');
  var queryParams = req.query;
  queryParams['partner_id'] = req.params.partner_id;
  queryParams['opportunity_id'] = req.params.opportunity_id;
  db.opportunity_xref.find(queryParams, function(err, opportunityClients){
    if (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.json(mod(opportunityClients));
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.opportunity_xref.find(id, function(err, opportunityClients){
    if (opportunityClients) {
      return res.json(opportunityClients);
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({});
    }
  });
});

router.post('/', (req, res, next) => {
  var db = req.app.get('db');
  var opportunityClient = req.body;
  opportunityClient['partner_id'] = req.params.partner_id;
  opportunityClient['opportunity_id'] = req.params.opportunity_id;
  opportunityClient.creation_date = new Date();
  opportunityClient.last_update_date = new Date();
  db.opportunity_xref.insert(opportunityClient, function(err, opportunityClient){
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(HttpStatus.CREATED).json(mod(opportunityClient));
  });
});

router.put('/:id', (req, res, next) => {
  var db = req.app.get('db');
  var opportunityClient = req.body;
  opportunityClient.last_update_date = new Date();
  opportunityClient.id = Number(req.params.id);
  db.opportunity_xref.save(opportunityClient, function(err, opportunityClient){
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(HttpStatus.OK).json(mod(opportunityClient));
  });
});

router.delete('/:id', (req, res, next) => {
  const results = [];
  var db = req.app.get('db');
  db.opportunity_xref.destroy({id: Number(req.params.id)}, function(err, opportunityClient){
      return res.status(HttpStatus.NO_CONTENT).json(opportunityClient);
  });
});

module.exports = router;
