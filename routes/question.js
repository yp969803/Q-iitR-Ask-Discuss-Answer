const express=require('express')
const mongoose=require('mongoose')
const router = express.Router();
const usermodel=require('../models/user')
const Question=require('../models/question')
const passport=require('passport')
const checkauthenticated=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/auth/login')
}
router.post('/newquestion',checkauthenticated,async(req,res)=>{
    const {question}=req.body
    console.log(req.body)
   try{
    const newQ=new Question({
        askBy:req.user.username,
        question:question,
        answers:[]
    })
    await newQ.save()
    console.log(newQ)
    res.redirect('/');
   }catch(e){
    console.log(e)
    res.redirect('/')
   }
})
router.get('/newquestion',checkauthenticated,(req,res)=>{
    res.render('newQuestion.ejs')
})
router.get('/showquestion/:id',checkauthenticated,async(req,res)=>{
    try{
        let question=await Question.findById(req.params.id);
         
       
       console.log(question)
       res.render('showQuestion.ejs',{data:question,name:req.user.username})
    }
    catch(e){
        console.log(e)
        res.redirect('/')
    }
    
})
    

router.post('/answer/:id',checkauthenticated,async(req,res)=>{
    const {answer}=req.body
    
    try{
        let question=await Question.findById(req.params.id);
         question.answers.push({
            answer:answer,
            givenby:req.user.username,
            
            
        })
       await question.save()
       console.log(question.answers)
       res.redirect(`/question/showquestion/${req.params.id}`)
    }
    catch(e){
        console.log(e)
        res.redirect(`/question/showquestion/${req.params.id}`)
    }

})
router.post('/editquestion/:id',checkauthenticated,async(req,res)=>{
    console.log(req.body)
    
    try{
        let editQuestion=await Question.findById(req.params.id);
        if(editQuestion.askBy===req.user.username){
            editQuestion.question=req.body.question
           
       await editQuestion.save()
       console.log(editQuestion)
       res.redirect('/myprofile')
        }
        else{
            res.send("This question is not created by you hence you will not able to update it")
        }
        
     

    }
    catch(e){
        console.log(e)
        res.redirect('/myprofile')
    }

})
router.post('/delete/:id',checkauthenticated,async(req,res)=>{
    // console.log(req.body)
    
    try{
        const editQuestion=await Question.findById(req.params.id);
        if(editQuestion.askBy===req.user.username){
       await editQuestion.delete()
       console.log(`Deleted question with id ${req.params.id}`)
       res.redirect('/profile/myprofile')
        }
        else{
            res.send("This question is not created by you hence you will not able to delete it")
        }
    }
    catch(e){
        console.log(e)
        res.redirect('/profilr/myprofile')
    }

})
                  

module.exports=router