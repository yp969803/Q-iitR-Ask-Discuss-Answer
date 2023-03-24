const mongoose=require('mongoose')
const Schema=mongoose.Schema

const userschema=new Schema({
  username:{
    type:String
   },
  name:{
    type:String
  },
  bio:{
    type:String
  },
  image:{
     data:Buffer,
     contentType:String,
  }
})

module.exports=mongoose.model('profile',userschema)
