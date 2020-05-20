const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://127.0.0.1:27017/';
const dbname = 'conFusion';
const dboperations = require('./operations');


MongoClient.connect(url).then((client)=>{
     // assert.equal(err,null);
     console.log('connected correctly to the server!');

     const db = client.db(dbname);
     
     dboperations.insertDocument(db,{fname:"Aakanksha",lname:"Kelkar"},'dishes')
     .then((result)=>{
          console.log('Insert Document:\n',result.ops);

          return dboperations.findDocument(db,'dishes')
     })
     .then((docs)=>{
          console.log("Found Documents:\n ",docs);

          return dboperations.updateDocument(db,{fname:'Aakanksha'},{lname:'Gupta'},'dishes')
     })
     .then((result)=>{
          console.log('Updated Document:\n',result.result);

          return dboperations.findDocument(db,'dishes')
     })
     .then((docs)=>{
          console.log("Found Documents:\n ",docs);

          return db.dropCollection('dishes')
     })
     .then((result)=>{
          console.log('Dropped Collection:',result);
          client.close();
     })
     .catch((error)=>console.log(error));
}).catch((error)=>console.log(error));