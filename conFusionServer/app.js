var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/DishRouter');
var leaderRouter = require('./routes/LeaderRouter');
var promotionRouter = require('./routes/PromotionRouter');
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');



//MONDO DB
const mongoose = require('mongoose');
const Dishes = require('./model/dishes');
const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db)=>{
  console.log('CONNECTED TO SERVER SUCCESSFULL!!');
},(err)=>{
  console.log(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());


app.use('/', indexRouter);
app.use('/users', usersRouter);

//at this point the app uses to fetch data from public folder so authentication will be applied before this usage.
//so after this whichever app.use(middleware) is added will only be applicable to authenticated users. 
app.use(express.static(path.join(__dirname, 'public'))); 


// mounting all directories
app.use('/dishes',dishRouter);
app.use('/promotions',promotionRouter);
app.use('/leaders',leaderRouter);

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
