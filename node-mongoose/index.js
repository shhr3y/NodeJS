const mongoose = require('mongoose');
const Dishes = require('./model/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db)=>{
     console.log('connected correctly to the server!\n');

     Dishes.create({
          name:'Uthappizza',
          description:'test for uthappizza'
     }).then((dish)=>{
          console.log(dish);

          return Dishes.findByIdAndUpdate(dish._id,{
               $set:{description:'updated test for uthappizza'},
          },{
               new:true       //this command will return the upadated dish
          }).exec();
     }).then((dish)=>{
          console.log(dish);

          dish.comments.push({
               rating:5,
               comment:"Shrey loves Aakanksha",
               author:"Shrey Gupta"
          });
          return dish.save();

     }).then((dish)=>{
          console.log(dish);
          return Dishes.remove({});
     }).then(()=>{
          return mongoose.connection.close();
     }).catch((error)=>{
          console.log(error);
     });
})


