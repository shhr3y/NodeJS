const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);

const leadersSchema = new Schema({                               //
     name: {
          type: String,
          required:true,
          unique:true
     },
     image: {
          type:String,
          required:true
     },
     designation: {
          type:String,
          default:''
     },
     abbr: {
          type:String,
          required:true
     },
     featured: {
          type:Boolean,
          default:false
     },
     description: {
          type:String,
          required:true,
     }
},{
     timestamps:true
});


var Leaders = mongoose.model('Leader',leadersSchema);            //

module.exports = Leaders;                                        //