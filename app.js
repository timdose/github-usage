var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');

var routes = require('./routes/index');
var api = require('./routes/api');

var app = express();


// view engine setup
var env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});

env.addFilter('stringify', function(str) {
  return JSON.stringify(str, null, '    ');
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'nunjucks');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    if ( process.env.NODE_ENV == 'local' ) {
        console.log('GH_USERNAME:', process.env.GH_USERNAME );
        res.locals.globals = {
            autoSubmit: process.env.GH_USERNAME || 'timdose'
        }
    }
    next();
});

app.use('/', routes);
app.use('/api', api);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.html', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;
