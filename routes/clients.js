var express = require('express');
var router = express.Router();
const path = require('path');
var HttpStatus = require('http-status-codes');
var _ = require('lodash');
var clientDisabilities = require('./client_disabilities');
var clientEducationEmployment = require('./client_education_employment');
var clientIncome = require('./client_income');
var clientHealth = require('./client_health');
var clientHousing = require('./housing');

router.use('/:clientId/disabilities', clientDisabilities);
router.use('/:clientId/educationAndEmployments', clientEducationEmployment);
router.use('/:clientId/incomes', clientIncome);
router.use('/:clientId/healthes', clientHealth);
router.use('/:clientId/housings', clientHousing);


/* GET clients listing. */
router.get('/', (req, res, next) => {
  var db = req.app.get('db');
  db.client_v.find(req.query, function(err, clients){
    return res.json(_.map(clients, cleanseArrays));
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.client_v.findOne({"id": id}, function(err, client){
    if (client) {
      return res.json(cleanseArrays(client));
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({});
    }
  });
});

router.get('/:id/engagements', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.client_engagement_v.find({"client_id": id}, function(err, clientEngagements){
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }

    if (clientEngagements) {
      var responses = [];
      _.forEach(clientEngagements, function(clientEngagement) {
        var response = {};
        response['client_id'] = clientEngagement.client_id;
        if (clientEngagement.enrollment_id) {
          response.program_href = "/agencies/" + clientEngagement.agency_id + "/programs/" + clientEngagement.program_id;
        }
        if (clientEngagement.opportunity_id) {
          response.opportunity_href = "/partners/" + clientEngagement.partner_id + "/opportunities/" + clientEngagement.opportunity_id;
        }
        responses.push(response);
      });
      return res.json(responses);
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({});
    }
  });
});

router.post('/', (req, res, next) => {
  var db = req.app.get('db');
  var client = req.body;
  client.creation_date = new Date();
  client.last_update_date = new Date();
  db.client.insert(req.body, function(err, client){
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(HttpStatus.CREATED).json(cleanseArrays(client));
  });
});

router.put('/:id', (req, res, next) => {
  var db = req.app.get('db');
  var client = req.body;
  client.last_update_date = new Date();
  client.id = Number(req.params.id);
  db.client.save(client, function(err, client){
    return res.status(HttpStatus.OK).json(cleanseArrays(client));
  });
});

router.delete('/:id', (req, res, next) => {
  const results = [];
  var db = req.app.get('db');
  db.client.destroy({id: Number(req.params.id)}, function(err, client){
      return res.status(HttpStatus.NO_CONTENT).json(cleanseArrays(client));
  });
});

function cleanseArrays(client) {
  if (client.war_theaters) {
    client.war_theaters = client.war_theaters.substring(1, client.war_theaters.length - 1).replace(/\"/g, "").split(',');
  }
  return client;
}

module.exports = router;
