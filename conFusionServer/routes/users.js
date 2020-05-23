var express = require('express');
const bodyParser = require('body-parser');
var User = require('../model/users');


var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',function(req,res,next){
  User.findOne({username: req.body.username})
    .then((user)=>{
        if(user != null){
          var err = new Error('USER: '+req.body.username+' ALREADY EXISTS!');
          err.status= 403;
          next(err);
        }
        else{
          return User.create({
            username:req.body.username,
            password:req.body.password
          })
        }
    })
    .then((user)=>{
      res.statusCode=200;
      res.setHeader('ContentType','application/json');
      res.json({status: 'REGISTRATION SUCCESSFUL!', user:user});
    },(err)=> next(err))
    .catch((err)=>next(err))
});


router.post('/login',(req,res,next)=>{
  
  if (!req.session.user) {
    var authHeader = req.headers.authorization;

    if(!authHeader){
      var err = new Error('YOU ARE NOT AUTHENTICATED!!');
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err);
    }
  
    var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
  
    var username = auth[0];
    var password = auth[1];


    User.findOne({username:username})
      .then((user)=>{
        if(user===null){
          var err = new Error('USER:'+username+' DOES NOT EXISTS!!');
          err.status = 403;
          return next(err);
        }
        else if(user.password !== password){
          var err = new Error('INCORRECT PASSWORD FOR USER:'+username+'!!');
          err.status = 403;
          return next(err);
        }
        else if(username === username && password === password){
          req.session.user = 'authenticated';
          res.statusCode=200;
          res.setHeader('ContentType','text/plain');
          res.end('YOU ARE AUTHENTICATED!');
          next();
        }
      })
      .catch((err)=>next(err));
  }
  else{
    res.statusCode=200;
    res.setHeader('ContentType','text/plain');
    res.end('YOU ARE ALREADY AUTHENTICATED!');
  }  
});

router.get('/logout',(req,res)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');              //redirect to home page
  }
  else{
    var err = new Error('YOU NOT LOGGED IN!!');
    err.status = 403;
    return next(err);
  }
})

module.exports = router;
