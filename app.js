var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/kubakchat',{useNewUrlParser : true , useFindAndModify: false});
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var messagesRouter = require('./routes/messageController');

const uploadfile = require('express-fileupload');

var app = express();

app.use(uploadfile());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// defining an array to work as the database (temporary solution)
const ads = [
    {title: 'Hello, world (again)!'}
];

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', messagesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
