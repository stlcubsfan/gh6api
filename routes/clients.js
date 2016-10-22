var express = require('express');
var router = express.Router();
const path = require('path');
var HttpStatus = require('http-status-codes');
var _ = require('lodash');

/* GET clients listing. */
router.get('/', (req, res, next) => {
  var db = req.app.get('db');
  db.client.find(req.query, function(err, clients){
    return res.json(_.map(clients, cleanseArrays));
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.client.find(id, function(err, client){
    if (client) {
      return res.json(cleanseArrays(client));
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
