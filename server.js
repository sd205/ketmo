//console.log("server.js");

var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var env          = require('./env');
//var morgan  = require('morgan');

//setup up the Express app
var app = express();
//app.use(morgan('combined'));

// view engine setup - not used yet
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//set the log level (https://www.npmjs.com/package/morgan)
app.use(logger('dev'));

//use a JSON parser (https://www.npmjs.com/package/body-parser#bodyparserjsonoptions)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//use a cookie parser (https://www.npmjs.com/package/cookie-parser)
app.use(cookieParser());

app.get('/pagecount', function (req, res) {
  res.send('{ pageCount: -1 }');
});

//map the app root for static content to the public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/auth',express.static(path.join(__dirname, 'auth/public')));

if (env.isLocalhost()) {
  app.use('/test',express.static(path.join(__dirname, 'test/public')));
}

//map the routers
var authRouter = require('./auth/auth-router');
var services = require('./services');

app.use('/auth', authRouter);
app.use('/api', services);

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

//start the app
env.start(app);

