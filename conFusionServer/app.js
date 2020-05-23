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

//MONDO DB
const mongoose = require('mongoose');
const Dishes = require('./model/dishes');
const url = 'mongodb://127.0.0.1:27017/conFusion'
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
// app.use(cookieParser('12345-67890-09876-54321'));

app.use(session({
  name:'session-id',
  secret:'12345-67890-09876-54321',
  saveUninitialized:false,
  resave:false,
  store: new FileStore(),
}));

function auth(req,res,next){
  console.log(req.session);
  
  if (!req.session.user) {
    var authHeader = req.headers.authorization;

    if(!authHeader){
      var err = new Error('You are not Authenticated!!');
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err);
    }
  
    var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
  
  
    var username = auth[0];
    var password = auth[1];
  
    if(username === 'admin' && password === 'password'){
      req.session.user = 'admin';
      next();
    }else{
      var err = new Error('Authentication not Accepted!!');
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err); 
    }
  }else{
    if(req.session.user==='admin'){
      next();
    }
    else{
      var err = new Error('Authentication not Accepted!!');
      err.status = 401;
      return next(err); 
    }
  }

}

app.use(auth);
//at this point the app uses to fetch data from public folder so authentication will be applied before this usage.
//so after this whichever app.use(middleware) is added will only be applicable to authenticated users. 
app.use(express.static(path.join(__dirname, 'public'))); 


// mounting all directories
app.use('/', indexRouter);
app.use('/users', usersRouter);
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
