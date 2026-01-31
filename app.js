var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var expressSession = require('express-session');

var indexRouter = require('./routes/index');

var app = express();

// 1. Configuración de Vistas y Layouts
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');
// 2. Middleware de Login
app.use((req, res, next) => {
  console.log(`Nueva petición en ${req.hostname} a las ${(new Date()).toISOString()}`);
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 3. Configuración de Sesión
app.use(expressSession({
  secret: 'mi-clave-secreta-supersegura',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

// 4. Middleware Global de Usuario
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// 5. Rutas
app.use('/', indexRouter);

// Manejo de errores 
app.use(function(req, res, next) {
  next(createError(404));
});

// Manejador de errores general
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;