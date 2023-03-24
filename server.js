const express=require('express')
const app=express()
const bcrypt=require('bcrypt')
const mongoose=require('mongoose')
const usermodel=require('./models/user.js')
const passport=require('passport')
const flash=require('express-flash')
const session=require('express-session')
const methodoverride=require('method-override')
const question=require('./models/question')
app.use(methodoverride('_method'))   
app.set('view-engine','ejs')
const mongodbstore=require('connect-mongodb-session')(session)
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1/qIITR').then((res)=>console.log('mongod connected'));
  const store=new mongodbstore({
    uri: 'mongodb://127.0.0.1/qIITR',
  collection: 'mySessions'
  })
  app.use(flash())
app.use(session({
    secret:'helloworld',
    resave:false,
    saveUninitialized:false,
    store:store,
    cookie:{
        maxAge:100*1000*3600*24
    }

}))
app.use(express.urlencoded({extended:false}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/auth',require('./routes/auth'))
app.use('/question',require('./routes/question'))  
app.use('/answer',require('./routes/answer'))
app.use('/profile',require('./routes/profile'))
 
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

app.get('/',checkauthenticated,async(req,res)=>{
     try{
        const questions= await question.find().sort({createdAt:'desc'})
    
       res.render('index.ejs',{name:req.user.username,questions:questions})
     }catch(e){
        console.log(e)
        res.status(404).send("Internal server error")
     }
})

app.listen(80,()=>{
    console.log('app is started in port 80')
})
}