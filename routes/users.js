var express = require('express');
var router = express.Router();
const path = require('path');
var HttpStatus = require('http-status-codes');

/* GET users listing. */
router.get('/', (req, res, next) => {
  var db = req.app.get('db');
  db.user.find(req.query, function(err, users){
    return res.json(users);
  });
});

router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  var db = req.app.get('db');
  db.user.find(id, function(err, user){
    if (user) {
      return res.json(user);
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({});
    }
  });
});

router.post('/', (req, res, next) => {
  var db = req.app.get('db');
  var user = req.body;
  user.creation_date = new Date();
  user.last_update_date = new Date();
  db.user.insert(req.body, function(err, user){
    return res.status(HttpStatus.CREATED).json(user);
  });
});

router.put('/:id', (req, res, next) => {
  var db = req.app.get('db');
  var user = req.body;
  user.last_update_date = new Date();
  user.id = Number(req.params.id);
  db.user.save(user, function(err, user){
    return res.status(HttpStatus.OK).json(user);
  });
});

router.delete('/:id', (req, res, next) => {
  const results = [];
  var db = req.app.get('db');
  db.user.destroy({id: Number(req.params.id)}, function(err, user){
      return res.status(HttpStatus.NO_CONTENT).json(user);
  });
});

module.exports = router;
