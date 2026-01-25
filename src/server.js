const express=require('express');
const app=express();
const port=1616;
const connectDB=require('./config/db');
const {adminauth,userauth}=require('./middlewares/auth');
const User = require('./model/users');

app.use('/',(err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use('/admin',adminauth);
//app.use('/user',userauth);

app.get('/admin/home',(req,res)=>{
    res.send('from admin home');
});

app.get('/user/home',userauth,(req,res)=>{
    res.send('from user home');
});

app.post('/signup',async(req,res)=>{
    const userdata={
        firstName:"Mohamed",
        lastName:"Aslam",
        email:"slamaslam@gmail.com",
        password:"12345"
    }
    try{const user=new User(userdata);
    await user.save();
    res.send('user registered successfully');}
    catch(err){
        res.status(500).send('error in user registration');
    }

});


connectDB.then(()=>{
    console.log('database connected successfully');
    app.listen(port,()=>{

        console.log(`server is running on port ${port}`);
    }); 
}).catch((err)=>{
    console.log('failed to connect to database',err);
}
);



