
  
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
var Post = new Schema({
   username:{
    type: 'string',
   },
   title:{
     type: 'string',
   },
   headline:{
    type: 'string',
   },
   content:{
    type:'string',
   },
   page:{
    type: 'string',
   },
   date : { type : Date }


})
  
Post.plugin(passportLocalMongoose);
  
module.exports = mongoose.model('Post', Post)