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
router.post('/edit/:questionId/:answerId/:username',checkauthenticated,async(req,res)=>{
    console.log(req.body)
    console.log(req.params.questionId)
    console.log(req.params.answerId)
    console.log(req.params.username)
    try{
        let question=await Question.findById(req.params.questionId)
        console.log(question)
        // const newAnsArray=question.answers.map(element=>{
        //     if(element._id!==req.params.answerId){
        //         return element
        //     }
        //     else if(element.givenby!==req.params.username){
        //         return element
        //     }
        //     else{
        //         element.answer=req.body.editanswer
        //         return element
        //     }
        // })
        // question.answers=newAnsArray
        question.answers.forEach(element=>{
            console.log(element.id)
            if(element._id==req.params.answerId){
                console.log("Ye lo element")
                element.answer=req.body.answer
                console.log(element.answer)
            }
        })
        await question.save()
        res.redirect(`/question/showquestion/${req.params.questionId}`)

    }
    catch(e){
        console.log(e)
        res.redirect('/')
    }
})
router.post('/likes/:questionId/:answerId/:username',checkauthenticated,async(req,res)=>{
    // console.log(req.body)
    let question=await Question.findById(req.params.questionId)
    try{
        question.answers.forEach(element=>{
            if(element._id===req.params.answerId){
                element.likes++;

            }
        })
        
        await question.save()
        res.send("success")

    }
    catch(e){
        console.log(e)
        res.redirect('/')
    }
})
router.post('/delete/:questionId/:answerId/:username',checkauthenticated,async(req,res)=>{
    console.log(req.body)
    try{
        let question=await Question.findById(req.params.questionId)
        // const newAnsArray=question.answers.map(element=>{
        //     if(element._id===req.params.answerId){
        //         return 
        //     }
        //     else{
        //         return element
        //     }
            
        // })
        const newAnsArray=[]
        question.answers.forEach((element)=>{
             if(element._id!=req.params.answerId){
                newAnsArray.push(element)
             }
        })
        console.log(newAnsArray)
        question.answers=newAnsArray
        await question.save()
        console.log("Answer deleted")
        res.redirect(`/question/showquestion/${req.params.questionId}`)

    }
    catch(e){
        console.log(e)
        res.redirect(`/question/showquestion/${req.params.questionId}`)
    }
})




module.exports=router