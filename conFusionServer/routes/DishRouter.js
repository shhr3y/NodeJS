const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Dishes = require('../model/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
     .get((req,res,next)=>{
          Dishes.find({})
          .populate('comments.author')
          .then((dishes)=>{
               res.statusCode=200;
               res.setHeader('ContentType','application/json');
               res.json(dishes);
          },(err)=>next(err))
          .catch((err)=>next(err));
     })
     .post(authenticate.verifyUser, (req,res,next)=>{
          Dishes.create(req.body)
          .then((dish)=>{
               console.log('DISH CREATED: ',dish);
               res.statusCode=200;
               res.setHeader('ContentType','application/json');
               res.json(dish);
          },(err)=>next(err))
          .catch((err)=>next(err));
     })
     .put(authenticate.verifyUser,(req,res,next)=>{
          res.statusCode = 403;
          res.end('PUT operation not supported on /dishes!');
     })
     .delete(authenticate.verifyUser,(req,res,next)=>{
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
          .populate('comments.author')
          .then((dish)=>{
               res.statusCode=200;
               res.setHeader('ContentType','application/json');
               res.json(dish);
          },(err)=>next(err))
          .catch((err)=>next(err));
     })
     .post(authenticate.verifyUser,(req,res,next)=>{
          res.statusCode = 403;
          res.end('POST operation not supported on /dishes/'+req.params.dishID+'!');
     })
     .put(authenticate.verifyUser,(req,res,next)=>{
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




     dishRouter.route('/:dishID/comments')
     .get((req,res,next)=>{
          Dishes.findById(req.params.dishID)
          .populate('comments.author')
          .then((dish)=>{
               if(dish != null){
                    res.statusCode=200;
                    res.setHeader('ContentType','application/json');
                    res.json(dish.comments);
               }else{
                    err = new Error('Dish with ID:'+req.params.dishID+' does not EXISTS!!');
                    err.status = 404;
                    return next(err);
               }
          },(err)=>next(err))
          .catch((err)=>next(err));
     })
     .post(authenticate.verifyUser,(req,res,next)=>{
          Dishes.findById(req.params.dishID)
          .then((dish)=>{
               if(dish != null){
                    console.log(req.user);                                 // // // // // /// // // // // // //
                    req.body.author = req.user._id;
                    dish.comments.push(req.body);
                    dish.save()
                    .then((dish)=>{
                         Dishes.findById(dish._id)
                              .populate('comments.author')
                              .then((dish)=>{
                                   res.statusCode=200;
                                   res.setHeader('ContentType','application/json');
                                   res.json(dish);
                              })
                    },(err)=>next(err))            //////////////////////////////
               }else{
                    err = new Error('Dish with ID:'+req.params.dishID+' does not EXISTS!!');
                    err.status = 404;
                    return next(err);
               }
          },(err)=>next(err))
          .catch((err)=>next(err));
     })
     .put(authenticate.verifyUser,(req,res,next)=>{
          res.statusCode = 403;
          res.end('PUT operation not supported on /dishes/'+req.params.dishID+'/comments!');
     })
     .delete(authenticate.verifyUser,(req,res,next)=>{
          Dishes.findById(req.params.dishID)
          .then((dish)=>{
               if(dish != null){
                    for(var i=(dish.comments.length -1);i>=0;i--){
                         dish.comments.id(dish.comments[i].id).remove();
                    }
                    dish.save()
                    .then((dish)=>{
                         res.statusCode=200;
                         res.setHeader('ContentType','application/json');
                         res.json(dish);
                    });
               }else{
                    err = new Error('Dish with ID:'+req.params.dishID+' does not EXISTS!!');
                    err.status = 404;
                    return next(err);
               }
          },(err)=>next(err))
          .catch((err)=>next(err));
     });



dishRouter.route('/:dishID/comments/:commentID')
     .get((req,res,next)=>{
          Dishes.findById(req.params.dishID)
          .populate('comments.author')
          .then((dish)=>{
               if(dish != null && dish.comments.id(req.params.commentID)!=null){
                    res.statusCode=200;
                    res.setHeader('ContentType','application/json');
                    res.json(dish.comments.id(req.params.commentID));
               }else if(dish == null){
                    err = new Error('Dish with ID:'+req.params.dishID+' does not EXISTS!!');
                    err.status = 404;
                    return next(err);
               }
               else {
                    err = new Error('Comment with ID:'+req.params.commentID+' does not EXISTS!!');
                    err.status = 404;
                    return next(err);
               }
          },(err)=>next(err))
          .catch((err)=>next(err));
     })
     .post(authenticate.verifyUser,(req,res,next)=>{
          res.statusCode = 403;
          res.end('POST operation not supported on /dishes/'+req.params.dishID+'/comments/'+req.params.commentID+'!');
     })
     .put(authenticate.verifyUser,(req,res,next)=>{
          Dishes.findById(req.params.dishID)
          .then((dish)=>{
               if(dish != null && dish.comments.id(req.params.commentID)!=null){
                    if(req.body.rating){
                         dish.comments.id(req.params.commentID).rating = req.body.rating;
                    }
                    if(req.body.comment){
                         dish.comments.id(req.params.commentID).comment = req.body.comment;
                    }
                    dish.save()
                    .then((dish)=>{
                         Dishes.findById(dish._id)
                              .populate('comments.author')
                              .then((dish)=>{
                                   res.statusCode=200;
                                   res.setHeader('ContentType','application/json');
                                   res.json(dish);
                              })
                    },(err)=>next(err))  
               }else if(dish == null){
                    err = new Error('Dish with ID:'+req.params.dishID+' does not EXISTS!!');
                    err.status = 404;
                    return next(err);
               }
               else {
                    err = new Error('Comment with ID:'+req.params.commentID+' does not EXISTS!!');
                    err.status = 404;
                    return next(err);
               }
          },(err)=>next(err))
          .catch((err)=>next(err));
     })

     .delete(authenticate.verifyUser,(req,res,next)=>{
          Dishes.findById(req.params.dishID)
          .then((dish)=>{
               if(dish != null && dish.comments.id(req.params.commentID)!=null){
                    dish.comments.id(req.params.commentID).remove();
                    dish.save()
                    .then((dish)=>{
                         Dishes.findById(dish._id)
                         .populate('comments.author')
                         .then((dish)=>{
                              res.statusCode=200;
                              res.setHeader('ContentType','application/json');
                              res.json(dish);
                         })
                    });
               }else if(dish == null){
                    err = new Error('Dish with ID:'+req.params.dishID+' does not EXISTS!!');
                    err.status = 404;
                    return next(err);
               }
               else {
                    err = new Error('Comment with ID:'+req.params.commentID+' does not EXISTS!!');
                    err.status = 404;
                    return next(err);
               }
          },(err)=>next(err))
          .catch((err)=>next(err));
     })


module.exports = dishRouter;