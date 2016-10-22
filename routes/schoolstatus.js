var express = require('express');
var router = express.Router();
const path = require('path');
const moment = require('moment');
var HttpStatus = require('http-status-codes');

router.get('/', (req, res, next) => {
  var db = req.app.get('db');
  db.schoolstatus.find(req.query, function(err, d){
    return res.json(d);
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.schoolstatus.find(id, function(err, d){
    if (d) {
      return res.json(d);
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({});
    }
  });
});

module.exports = router;