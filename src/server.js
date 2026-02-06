const express=require('express');
const app=express();
const port=1616;
const connectDB=require('./config/db');
const {adminauth,userauth}=require('./middlewares/auth');
const User = require('./model/users');
//to parse json data in request body and allow any post request 
// to accept the incoming req body

app.use(express.json());

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
    

    try{const user=new User(req.body);
    await user.save();
    res.send('user registered successfully');}
    catch(err){
        res.status(500).send('error in user registration');
    }
    console.log(req.body)

});

app.get('/listusers',async(req,res)=>{
    try{
        const users=await User.find();
        res.send(users);
    }
    catch(err){
        res.status(500).send('error in fetching users');
    }   
});

app.delete('/deleteuser',async(req,res)=>{
    try{
        const {id}=req.body;
        const user=await User.findByIdAndDelete(id,returnDocument='after');
        console.log("kk",user);
        res.send('user deleted successfully');
    }
    catch(err){
        res.status(500).send('error in deleting user');
    }
});
//patch method will update only the fields provided in the request body and keep the other fields unchanged
app.patch('/updateuser',async(req,res)=>{
    try{
        const {id,...updateData}=req.body;
        const user=await User.findByIdAndUpdate(id,updateData,{returnDocument:'after'});
        console.log("kk",user);
        res.send('user updated successfully');
    }
    catch(err){
        res.status(500).send('error in updating user');
    }
});
//put method will replace the entire document with the new data provided in the request body
app.put('/updateuser',async(req,res)=>{
    try{
        const {id,...updateData}=req.body;
        const user=await User.findOneAndReplace({_id:id},updateData,{returnDocument:'after'});
        console.log("kk",user);
        res.send('put user updated successfully');
    }
    catch(err){
        console.log(err);
        
        res.status(500).send('error in updating user');
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



