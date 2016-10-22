var express = require('express');
var router = express.Router();
const path = require('path');
var HttpStatus = require('http-status-codes');

/* GET clients listing. */
router.get('/', (req, res, next) => {
  var db = req.app.get('db');
  db.client.find(req.query, function(err, clients){
    return res.json(clients);
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.client.find(id, function(err, client){
    if (client) {
      return res.json(client);
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
    return res.status(HttpStatus.CREATED).json(client);
  });
});

router.put('/:id', (req, res, next) => {
  var db = req.app.get('db');
  var client = req.body;
  client.last_update_date = new Date();
  client.id = Number(req.params.id);
  db.client.save(client, function(err, client){
    return res.status(HttpStatus.OK).json(client);
  });
});

router.delete('/:id', (req, res, next) => {
  const results = [];
  var db = req.app.get('db');
  db.client.destroy({id: Number(req.params.id)}, function(err, client){
      return res.status(HttpStatus.NO_CONTENT).json(client);
  });
});

module.exports = router;
