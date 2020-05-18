const express = require('express');
const bodyParser = require('body-parser');


const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
     .all((req,res,next) => {
          res.statusCode = 200;
          res.setHeader= ('ContentType','text/plain');
          next();
     })
     .get((req,res,next)=>{
          res.end('Will send all the promotions to you!')
     })
     .post((req,res,next)=>{
          res.end('Will add promotion: "'+req.body.name+'" with details "'+req.body.description+'"')
     })
     .put((req,res,next)=>{
          res.statusCode = 403;
          res.end('PUT operation not supported on /promotions!');
     })
     .delete((req,res,next)=>{
          res.end('Deleting all the promotions!')
     });

promotionRouter.route('/:promotionID')
     .all((req,res,next)=>{
          res.statusCode = 200;
          res.setHeader= ('ContentType','text/plain');
          next();
     })
     .get((req,res,next)=>{
          res.end('Will send details of promotion: '+req.params.promotionID+' to you!');
     })
     .post((req,res,next)=>{
          res.statusCode = 403;
          res.end('POST operation not supported on /promotion/'+req.params.promotionID+'!');
     })
     .put((req,res,next)=>{
          res.write('Updating promotion: '+req.params.promotionID+'...\n');
          res.end('Will update the promotion: "'+req.body.name+'" with details "'+req.body.description+'"');
     })
     .delete((req,res,next)=>{
          res.end('Deleting promotion: '+req.params.promotionID+'!')
     })


module.exports = promotionRouter;