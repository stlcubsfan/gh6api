const express = require('express');
const router = express.Router();
const path = require('path');
var HttpStatus = require('http-status-codes');
var _ = require('lodash');

function bedCalc(agency) {
  if (agency.total_beds_available != undefined && agency.total_beds_available != null) {
    agency.hasBeds = true;
  } else {
    agency.hasBeds = false;
  }
  return agency;
}

function mod(agencies, req) {
  if (Array.isArray(agencies)) {
    for (var i = 0, len = agencies.length; i < len; i++) {
      bedCalc(agencies[i]);
    }
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
    db.run("select *, round((pos <@> point($1,$2))::numeric, 3) as distance from agency where round((pos <@> point($1,$2))::numeric, 3) < $3 order by distance",
      [xcoord, ycoord, req.query.range],
      function(err, agencies) {
        return res.json(mod(agencies, req));
      });
  } else {
    var queryParams = cleanQueryParams(req);
    db.agency.find(queryParams, function(err, agencies){
      return res.json(mod(agencies, req));
    });
  }
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.agency.find(id, function(err, agency){
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
