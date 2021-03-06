const express = require('express');
const router = express.Router();
const path = require('path');
var HttpStatus = require('http-status-codes');
var _ = require('lodash');
var reservations = require('./agency_reservations');
var programs = require('./programs');

router.use('/:agency_id/reservations', reservations);
router.use('/:agency_id/programs', programs);

function mod(agencies, req) {
  return agencies || {};
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
    db.run(`select *,
            round((pos <@> point($1,$2))::numeric, 3) as distance
            from agencyv
            where round((pos <@> point($1,$2))::numeric, 3) < $3
            and (beds_available > $4 or $4 is null)
            order by distance
    `,
      [xcoord, ycoord, req.query.range, req.query.beds_needed],
      function(err, agencies) {
        return res.json(mod(agencies, req));
      });
  } else {
    var queryParams = cleanQueryParams(req);
    if (req.query.beds_needed) {
      queryParams['beds_available >'] = req.query.beds_needed;
      delete queryParams['beds_needed'];
    }
    console.log(queryParams);
    db.agencyv.find(queryParams, function(err, agencies){
      return res.json(mod(agencies, req));
    });
  }
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.agencyv.find({"id": id}, function(err, agency){
    if (agency) {
      return res.json(mod(agency[0], req));
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({});
    }
  });
});

router.get('/:id/key-indicators', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.agency_kpi_v.findOne({"agency_id": id}, function(err, agencyKpis){
    if (agencyKpis) {
      return res.json(agencyKpis);
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
