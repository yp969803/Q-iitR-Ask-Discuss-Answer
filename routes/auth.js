const express=require('express')

const router = express.Router();
const passport=require('passport')
const { find, findOne } = require('../models/user.js')
const initializepassport=require('../middlewares/passport-config.js')
const usermodel=require('../models/user')

initializepassport(
    passport,
    async(username)=>await usermodel.findOne({username:username}),
    async(id)=>await usermodel.findById(id)
    )
const checkauthenticated=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/auth/login')
}
const checknotauthenticated=(req,res,next)=>{
    if(req.isAuthenticated()){
        return res.redirect('/')
    }
    next()
} 


router.get('/login',checknotauthenticated,(req,res)=>{
req.session.isAuth=true
res.render('login.ejs')

})
router.get('/register',checknotauthenticated,(req,res)=>{
    
    res.render('register.ejs',{name:"Welcome to Q-iitR"})
    
    })
router.post('/login',checknotauthenticated,passport.authenticate('local',{
successRedirect: '/',
failureRedirect:'/auth/login',
failureFlash:true


}))



router.post('/register',checknotauthenticated,async (req,res)=>{
try{
    console.log(req.body)
    const {username,password}=req.body
    
    let user=await usermodel.findOne({username: username});
    console.log(user)
    if(user){
        console.log(user)
         res.render('register.ejs',{name:`${username} this userId already exists`})
    }
    
   else{
    user=new usermodel({
        
        username:username,
        password:password,
        
    })
    
    await user.save()
    res.redirect('/auth/login')
   }
}
catch(err){
    console.log(err)
 res.redirect('/auth/register')
}
console.log(req.body)

})

router.post('/logout', function(req, res, next) {
req.logout(function(err) {
  if (err) { return next(err); }
  res.redirect('/');
});
});

module.exports=router