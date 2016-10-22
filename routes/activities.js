var express = require('express');
var router = express.Router();
const path = require('path');
var HttpStatus = require('http-status-codes');

/* GET users listing. */
router.get('/', (req, res, next) => {
  var db = req.app.get('db');
  db.activity.find(req.query, function(err, users){
    return res.json(users);
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
  activity.creation_date = new Date();
  activity.last_update_date = new Date();
  db.activity.insert(req.body, function(err, activity){
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
