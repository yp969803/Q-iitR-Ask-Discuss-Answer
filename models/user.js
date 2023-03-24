const mongoose=require('mongoose')
const passport = require('passport')
const Schema=mongoose.Schema
const userschema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
       type:String,
       min:4,
       require:true
    },
  
    
})

module.exports=mongoose.model('user',userschema)