var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var routes = require('./routes/index');
var users = require('./routes/users');
var agencies = require('./routes/agencies');
var activities = require('./routes/activities');
var clients = require('./routes/clients');
var disabilities = require('./routes/disabilities');
var disabilitiesresponses = require('./routes/disability_responses');
var educationlevel = require('./routes/educationlevel');
var employmenttype = require('./routes/employmenttype');
var notemployedreason = require('./routes/notemployedreason');
var schoolstatus = require('./routes/schoolstatus');
var partners = require('./routes/partners');
var noyes = require('./routes/noyes');
var whenoccured = require('./routes/whenoccured');
var healthstatus = require('./routes/healthstatus');

var app = express();
app.use(cors());
app.options('*', cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/agencies', agencies);
app.use('/agencies', agencies);
app.use('/activities', activities);
app.use('/clients', clients);
app.use('/disabilities', disabilities);
app.use('/disabilityResponses', disabilitiesresponses);
app.use('/educationlevels', educationlevel);
app.use('/employmenttypes', employmenttype);
app.use('/healthstatuses', healthstatus);
app.use('/notemployedreasons', notemployedreason);
app.use('/noyeses', noyes);
app.use('/partners', partners);
app.use('/schoolstatuses', schoolstatus);
app.use('/whenoccurs', whenoccured);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
