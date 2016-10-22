var express = require('express');
var router = express.Router({mergeParams: true});
const path = require('path');
const moment = require('moment');
var HttpStatus = require('http-status-codes');
var _ = require('lodash');
var opportunityClients = require('./opportunity_clients')

router.use('/:opportunity_id/clients', opportunityClients);

function addHref(opportunity) {
  if (opportunity) {
    opportunity['clients_href'] = '/partners/' + opportunity.partner_id + '/opportunities/'+ opportunity.id + '/clients';
  }
  return opportunity;
}

function mod(opportunities) {
  if (Array.isArray(opportunities)) {
    _.forEach(opportunities, function(opportunity) {
      addHref(opportunity);
    });
  } else {
    addHref(opportunities);
  }
  return opportunities || {};
}

router.get('/', (req, res, next) => {
  var db = req.app.get('db');
  var queryParams = req.query;
  queryParams['partner_id'] = req.params.partner_id;
  db.opportunityv.find(queryParams, function(err, opportunities){
    return res.json(mod(opportunities));
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.opportunityv.find({"id": id}, function(err, opportunity){
    if (opportunity) {
      return res.json(opportunity);
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({});
    }
  });
});

router.post('/', (req, res, next) => {
  var db = req.app.get('db');
  var opportunity = req.body;
  opportunity['partner_id'] = req.params.partner_id;
  opportunity.creation_date = new Date();
  opportunity.last_update_date = new Date();
  db.opportunity.insert(opportunity, function(err, opportunity){
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(HttpStatus.CREATED).json(mod(opportunity));
  });
});

router.put('/:id', (req, res, next) => {
  var db = req.app.get('db');
  var opportunity = req.body;
  opportunity.last_update_date = new Date();
  opportunity.id = Number(req.params.id);
  db.opportunity.save(opportunity, function(err, opportunity){
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(HttpStatus.OK).json(mod(opportunity));
  });
});

router.delete('/:id', (req, res, next) => {
  const results = [];
  var db = req.app.get('db');
  db.opportunity.destroy({id: Number(req.params.id)}, function(err, opportunity){
      return res.status(HttpStatus.NO_CONTENT).json(opportunity);
  });
});

module.exports = router;
