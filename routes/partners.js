const express = require('express');
const router = express.Router();
const path = require('path');
var HttpStatus = require('http-status-codes');
var _ = require('lodash');
var opportunities = require('./opportunities');

router.use('/:partner_id/opportunities', opportunities);

function addHref(partner) {
  if (partner) {
    partner['opportunities_href'] = '/partners/' + partner.id + '/opportunities';
  }
  return partner;
}

function mod(partners) {
  if (Array.isArray(partners)) {
    _.forEach(partners, function(partner) {
      addHref(partner);
    });
  } else {
    addHref(partners);
  }
  return partners || {};
}

router.get('/', (req, res, next) => {
  var db = req.app.get('db');
  var queryParams = req.query;
  db.partner.find(queryParams, function(err, partners){
    if (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.json(mod(partners));
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.partner.find({"id": id}, function(err, partner){
    if (partner) {
      return res.json(partner);
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({});
    }
  });
});

router.post('/', (req, res, next) => {
  var db = req.app.get('db');
  var partner = req.body;
  partner.creation_date = new Date();
  partner.last_update_date = new Date();
  db.partner.insert(partner, function(err, partner){
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(HttpStatus.CREATED).json(mod(partner));
  });
});

router.put('/:id', (req, res, next) => {
  var db = req.app.get('db');
  var partner = req.body;
  partner.last_update_date = new Date();
  partner.id = Number(req.params.id);
  db.partner.save(partner, function(err, partner){
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    }
    return res.status(HttpStatus.OK).json(mod(partner));
  });
});

router.delete('/:id', (req, res, next) => {
  const results = [];
  var db = req.app.get('db');
  db.partner.destroy({id: Number(req.params.id)}, function(err, partner){
      return res.status(HttpStatus.NO_CONTENT).json(partner);
  });
});

module.exports = router;
