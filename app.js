var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
require('./db');

/*
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/flycar');
require('./models/Usuario');
require('./models/Ruta');
require('./models/Waypoint');
require('./models/Subpoint');
*/

// Obtenemos todas la rutas usando el directorio
var router = require('./routes');

/* Obtenemos cada ruta por separado
var index = require('./routes/index');
var usuarios = require('./routes/usuarios');
var rutas = require('./routes/rutas');
var referencias = require('./routes/referencias');
var subpuntos = require('./routes/subpuntos');
*/

var app = express();

// Habilitar cors para todas los orígenes
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/angular', express.static(__dirname + '/node_modules/angular/'));
app.use('/uirouter', express.static(__dirname + '/node_modules/@uirouter/angularjs/release/'));
app.use(express.static(path.join(__dirname, 'data')));


app.use('/api/v0.1', router);
/*
app.use('/api', index);
app.use('/usuarios', usuarios);
*/


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  //var err = new Error('Not Found');
  //err.status = 404;
  //next(err);
  res.set('Content-Type', 'application/json');
  return res.status(404).json({
    message: 'Not Found'
  });
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //res.status(err.status || 500);
  //res.render('error');
  console.log(err);
  res.set('Content-Type', 'application/json');
  return res.status(err.status || 500).json({
    message: 'Ups! Algo salió mal. Vuelve a intentarlo más tarde.'
  });
});

module.exports = app;
