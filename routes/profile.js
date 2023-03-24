const express=require('express')
const multer=require('multer')
const mongoose=require('mongoose')
const router = express.Router();
const usermodel=require('../models/user')
const profilemodel=require('../models/profile')
const Question=require('../models/question')
const passport=require('passport')
const checkauthenticated=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/auth/login')
}
router.get('/edit',checkauthenticated,async(req,res)=>{
    try{
        let user=await profilemodel.find({username:req.user.username})
        if(user.length!=0){
            
             res.render('editProfile.ejs',{userData:user[0],username:req.user.username})
             
         }
         else{
            res.render('editProfile.ejs',{userData:{name:"Guest",bio:"Guest bio"},username:req.user.username})
         }
    }
    catch(e){
        console.log(e)
        res.redirect('/profile/myprofile')
    }
})
router.post("/edit",checkauthenticated,async(req,res)=>{
    console.log(req.body)
    try{
      let user=await profilemodel.find({username:req.user.username})
      if(user.length!=0){
         user[0].name=req.body.name,
         user[0].bio=req.body.bio
         await user[0].save()
         res.redirect('/profile/myprofile')

      }
      else{
        const newUser=new profilemodel({
            username:req.user.username,
            name:req.body.name,
            bio:req.body.bio
        })
        await newUser.save()
        req.redirect('/profile/myprofile')
      }

    }catch(e){
       console.log("Internal server error")
       res.redirect('/profile/myprofile')
    }
})
router.get("/myprofile",checkauthenticated,async(req,res)=>{
    try{
        let user=await profilemodel.find({username:req.user.username})
        let questions=await Question.find({askBy:req.user.username})
        // let  answers=await Question.find({answers:{
        //     $elemMatch:{givenby:req.user.username}
        // }})
    
        // console.log(user)
        if(user.length!=0){
            res.render('myProfile.ejs',{userData:user[0],username:req.user.username,questions:questions})
        }
        else{
            res.render('myProfile.ejs',{userData:{name:"Guest",bio:"Guest bio"},username:req.user.username,questions:questions})
        }
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})

router.get('/showprofile/:username',checkauthenticated,async(req,res)=>{
    try{
        let user=await profilemodel.find({username:req.params.username})
        if(user.length!=0){
            res.render('showProfile.ejs',{userData:user[0],username:req.params.username})
        }
        else{
            res.render('showProfile.ejs',{userData:{name:"Guest",bio:"Guest bio"},username:req.params.username})
        }
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})


module.exports=router