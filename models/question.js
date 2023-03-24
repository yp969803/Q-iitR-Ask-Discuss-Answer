const mongoose=require('mongoose')
const passport = require('passport')
const Schema=mongoose.Schema
const userschema=new Schema({
    askBy:{
        type:String,
        required:true,
      },
    question:{
        type:String
        // required:true,
        // trim:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    
    answers:[{
        answer:{
            type:String
            
        },
        givenby:{
            type:String
            
            
        },
        date:{
            type:Date,
            default:Date.now()

        },
        likes:{
            type:Number,
            default:0
        }
    }],
    likes:{
        type:Number,
        default:0,
    }
    
})

module.exports=mongoose.model('question',userschema)