const express = require('express');
const router = express.Router();
const path = require('path');
var HttpStatus = require('http-status-codes');
var _ = require('lodash');
var reservations = require('./agency_reservations');

router.use('/:agency_id/reservations', reservations);

function bedCalc(agency) {
  agency.hasBeds = false;

  if (agency.total_beds_available) {
    agency.beds_available = agency.total_beds_available - agency.reservation_count;
    if (agency.beds_available > 0) {
      agency.hasBeds = true;
    }
  }
  return agency;
}

function mod(agencies, req) {
  if (Array.isArray(agencies)) {
    _.forEach(agencies, function(agency) {
      bedCalc(agency);
    });
  } else {
    bedCalc(agencies);
  }

  if (req.query.hasBeds) {
    agencies = _.filter(agencies, ['hasBeds', (req.query.hasBeds == "true" ? true : false)]);
  }
  return agencies;
}

function cleanQueryParams(req) {
  var params = _.clone(req.query);
  delete params['hasBeds'];
  return params;
}

router.post('/', (req, res, next) => {
  var db = req.app.get('db');
  var agency = req.body;
  var geoloc = agency.pos;
  agency.creation_date = new Date();
  agency.last_update_date = new Date();
  delete agency['pos'];
  db.agency.insert(req.body, function(err, agency){
    return res.status(HttpStatus.CREATED).json(agency);
  });
});

router.put('/:id', (req, res, next) => {
  var db = req.app.get('db');
  var agency = req.body;
  delete agency['pos'];
  agency.last_update_date = new Date();
  agency.id = Number(req.params.id);
  db.agency.save(agency, function(err, agency){
    return res.status(HttpStatus.OK).json(agency);
  });
});

router.get('/', (req, res, next) => {
  var db = req.app.get('db');
  if (req.query.range) {
    var xcoord = req.query.xpos;
    var ycoord = req.query.ypos;
    db.run("select *, round((pos <@> point($1,$2))::numeric, 3) as distance from agency_v where round((pos <@> point($1,$2))::numeric, 3) < $3 order by distance",
      [ycoord, xcoord, req.query.range],
      function(err, agencies) {
        return res.json(mod(agencies, req));
      });
  } else {
    var queryParams = cleanQueryParams(req);
    db.agencyv.find(queryParams, function(err, agencies){
      return res.json(mod(agencies, req));
    });
  }
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.agencyv.find({id: id}, function(err, agency){
    if (agency) {
      return res.json(mod(agency, req));
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({});
    }
  });
});

router.delete('/:id', (req, res, next) => {
  const results = [];
  var db = req.app.get('db');
  db.agency.destroy({id: Number(req.params.id)}, function(err, agency){
      return res.status(HttpStatus.NO_CONTENT).json(agency);
  });
});

module.exports = router;
