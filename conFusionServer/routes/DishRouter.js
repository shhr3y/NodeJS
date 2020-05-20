const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../model/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
     .get((req,res,next)=>{
          Dishes.find({})
          .then((dishes)=>{
               res.statusCode=200;
               res.setHeader('ContentType','application/json');
               res.json(dishes);
          },(err)=>next(err))
          .catch((err)=>next(err));
     })
     .post((req,res,next)=>{
          Dishes.create(req.body)
          .then((dish)=>{
               console.log('DISH CREATED: ',dish);
               res.statusCode=200;
               res.setHeader('ContentType','application/json');
               res.json(dish);
          },(err)=>next(err))
          .catch((err)=>next(err));
     })
     .put((req,res,next)=>{
          res.statusCode = 403;
          res.end('PUT operation not supported on /dishes!');
     })
     .delete((req,res,next)=>{
          Dishes.remove({})
          .then((response)=>{
               res.statusCode=200;
               res.setHeader('ContentType','application/json');
               res.json(response);
          },(err)=>next(err))
          .catch((err)=>next(err));
     });



dishRouter.route('/:dishID')
     .get((req,res,next)=>{
          Dishes.findById(req.params.dishID)
          .then((dish)=>{
               res.statusCode=200;
               res.setHeader('ContentType','application/json');
               res.json(dish);
          },(err)=>next(err))
          .catch((err)=>next(err));
     })
     .post((req,res,next)=>{
          res.statusCode = 403;
          res.end('POST operation not supported on /dishes/'+req.params.dishID+'!');
     })
     .put((req,res,next)=>{
          Dishes.findByIdAndUpdate(req.params.dishID,{
               $set: req.body
          }, {new:true})
          .then((dish)=>{
               res.statusCode=200;
               res.setHeader('ContentType','application/json');
               res.json(dish);
          },(err)=>next(err))
          .catch((err)=>next(err));
     })

     .delete((req,res,next)=>{
          Dishes.findByIdAndRemove(req.params.dishID)
          .then((dish)=>{
               res.statusCode=200;
               res.setHeader('ContentType','application/json');
               res.json(dish);
          },(err)=>next(err))
          .catch((err)=>next(err));
     })


module.exports = dishRouter;