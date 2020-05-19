const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://127.0.0.1:27017/';
const dbname = 'conFusion';
const dboperations = require('./operations');


MongoClient.connect(url,(err,client)=>{
     assert.equal(err,null);
     console.log('connected correctly to the server!');

     const db = client.db(dbname);
     
     dboperations.insertDocument(db,{fname:"Aakanksha",lname:"Kelkar"},'dishes',(result)=>{
          console.log('Insert Document:\n',result.ops);

          dboperations.findDocument(db,'dishes',(docs)=>{
               console.log("Found Documents:\n ",docs);

               dboperations.updateDocument(db,{fname:'Aakanksha'},{lname:'Gupta'},'dishes',(result)=>{
                    console.log('Updated Document:\n',result.result);

                    dboperations.findDocument(db,'dishes',(docs)=>{
                         console.log("Found Documents:\n ",docs);

                         db.dropCollection('dishes',(err,result)=>{
                              assert.equal(err,null);
                              console.log('Dropped Collection:',result);
                              client.close();
                         });
                    });
               });
          });
     });
});