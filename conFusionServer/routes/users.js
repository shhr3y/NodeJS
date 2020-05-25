var express = require('express');
const bodyParser = require('body-parser');
var User = require('../model/users');
var passport = require('passport');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',function(req,res,next){
  User.register(new User({username: req.body.username}),req.body.password,(err,user) => {
        if(err){
          res.statusCode=500;
          res.setHeader('ContentType','application/json');
          res.json({err:err});
        }
        else{
          passport.authenticate('local')(req,res,()=>{
            res.statusCode=200;
            res.setHeader('ContentType','application/json');
            res.json({ success: true, status: 'REGISTRATION SUCCESSFUL!'});
          });
        }
    });
});



router.post('/login',passport.authenticate('local'),(req,res)=>{
  res.statusCode=200;
  res.setHeader('ContentType','application/json');
  res.json({ success: true, status: 'LOGIN SUCCESSFUL!'});
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
