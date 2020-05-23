var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var User = new Schema({
     username: {
          type:String,
          required:true,
          unique:true,
     },
     password: {
          type:String,
          required:true,
          min:3,
     },
     admin:{
          type:Boolean,
          default:false
     }
});


module.exports = mongoose.model('User',User);