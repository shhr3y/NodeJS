const mongoose = require('mongoose');
const Dishes = require('./model/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db)=>{
     console.log('connected correctly to the server!\n');

     var newDish = Dishes({
          name:'Uthapsspizza',
          description:'test for uthappssizza'
     });

     newDish.save()
          .then((dish)=>{
               console.log(dish);

               return Dishes.find({}).exec();
          }).then((dishes)=>{
               console.log(dishes);

               return Dishes.remove();
          }).then(()=>{
               return mongoose.connection.close();
          }).catch((error)=>{
               console.log(error);
          });
})


