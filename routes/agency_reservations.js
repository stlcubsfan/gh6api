var express = require('express');
var router = express.Router({mergeParams: true});
const path = require('path');
const moment = require('moment');
var HttpStatus = require('http-status-codes');
var _ = require('lodash');

function addHref(rsv) {
  if (rsv) {
    rsv['client_href'] = '/clients/' + rsv.client_id;
    rsv['agency_href'] = '/agencies/' + rsv.agency_id;
  }
  return rsv;
}

function mod(reservations) {
  if (Array.isArray(reservations)) {
    _.forEach(reservations, function(reservation) {
      addHref(reservation);
    });
  } else {
    addHref(reservations);
  }
  return reservations || {};
}

/* GET activities listing. */
router.get('/', (req, res, next) => {
  // return res.json({'name': req.params.agency_id});
  var db = req.app.get('db');
  var queryParams = req.query;
  queryParams['agency_id'] = req.params.agency_id;
  var start = new Date();
  start.setHours(0,0,0,0);
  queryParams['happened_on >='] = start;
  queryParams['type'] = 'RESERVATION';
  db.activity.find(queryParams, function(err, activities){
    return res.json(mod(activities));
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.activity.find(id, function(err, activity){
    if (activity) {
      return res.json(activity);
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({});
    }
  });
});

router.post('/', (req, res, next) => {
  var db = req.app.get('db');
  var activity = req.body;
  activity['agency_id'] = req.params.agency_id;
  activity.happened_on = moment(req.body.happened_on).toISOString();
  activity.creation_date = new Date();
  activity.last_update_date = new Date();
  db.activity.insert(activity, function(err, activity){
    return res.status(HttpStatus.CREATED).json(activity);
  });
});

router.put('/:id', (req, res, next) => {
  var db = req.app.get('db');
  var activity = req.body;
  activity.last_update_date = new Date();
  activity.id = Number(req.params.id);
  db.activity.save(activity, function(err, activity){
    return res.status(HttpStatus.OK).json(activity);
  });
});

router.delete('/:id', (req, res, next) => {
  const results = [];
  var db = req.app.get('db');
  db.activity.destroy({id: Number(req.params.id)}, function(err, activity){
      return res.status(HttpStatus.NO_CONTENT).json(activity);
  });
});

module.exports = router;
