var express = require('express');
var router = express.Router({mergeParams: true});
const path = require('path');
const moment = require('moment');
var HttpStatus = require('http-status-codes');

router.get('/', (req, res, next) => {
  var db = req.app.get('db');
  var queryParams = req.query;
  queryParams['client_id'] = req.params.clientId;
  console.log(queryParams);
  db.client_housing.find(queryParams, {order: "date_noted desc"}, function(err, clientHousings){
    return res.json(clientHousings || []);
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var queryParams = req.query;
  queryParams['client_id'] = req.params.clientId;
  queryParams['id'] = req.params.id;
  var db = req.app.get('db');
  db.client_housing.findOne(queryParams, function(err, client_housing){
    if (client_housing) {
      return res.json(client_housing);
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({});
    }
  });
});

router.post('/', (req, res, next) => {
  var db = req.app.get('db');
  var clientHousing = req.body;
  clientHousing.client_id = req.params.clientId;
  if (!clientHousing.date_noted) {
    clientHousing.date_noted = new Date();
  }
  clientHousing.creation_date = new Date();
  clientHousing.last_update_date = new Date();
  db.client_housing.insert(clientHousing, function(err, clientHousing){
    if (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
    };
    return res.status(HttpStatus.CREATED).json(clientHousing);
  });
});

router.put('/:id', (req, res, next) => {
  var db = req.app.get('db');
  var clientHousing = req.body;
  clientHousing.last_updated_date = new Date();
  clientHousing.id = Number(req.params.id);
  db.client_housing.save(clientHousing, function(err, clientHousing){
    return res.status(HttpStatus.OK).json(clientHousing);
  });
});

router.delete('/:id', (req, res, next) => {
  const results = [];
  var db = req.app.get('db');
  db.client_housing.destroy({id: Number(req.params.id)}, function(err, clientHousing){
      return res.status(HttpStatus.NO_CONTENT).json(clientHousing);
  });
});

module.exports = router;
