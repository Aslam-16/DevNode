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
        res.status(500).send('error in user registration '+err);
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
//patch method will update only the fields provided in the request body and keep the other fields unchanged*
app.patch('/updateuser',async(req,res)=>{
    try{
        const {id,...updateData}=req.body;
        const ALLOWED_FIELDS=['firstname','lastname','age','gender','photourl','skills'];
        const updateFields=Object.keys(updateData);
        //const newupdatedData=ALLOWED_FIELDS.reduce((acc,field)=>{if(updateFields.includes(field)){ acc[field]=updateData[field]; } return acc; },{});
        //console.log("newupdatedData",newupdatedData);
        const isValid=updateFields.every((field)=> ALLOWED_FIELDS.includes(field));
        const notallowed=updateFields.filter((field)=> !ALLOWED_FIELDS.includes(field)).join(',');
        if(!isValid) throw new Error('invalid fields to update data '+notallowed);
        const user=await User.findByIdAndUpdate(id,updateData,{returnDocument:'after',runValidators:true});
        console.log("kk",user);
        res.send('user updated successfully');
    }
    catch(err){
        res.status(500).send('error in updating user '+err);
    }
});
//put method will replace the entire document with the new data provided in the request body
// app.put('/updateuser',async(req,res)=>{
//     try{

//         const {id,...updateData}=req.body;
//         const ALLOWED_FIELDS=['firstname','lastname','age','gender','photourl','skills'];
//         const updateFields=Object.keys(updateData);
//         const isValid=updateFields.every((field)=> ALLOWED_FIELDS.includes(field));
//         if(!isValid) throw new Error('invalid fields in update data');
//         const user=await User.findOneAndReplace({_id:id},updateData,{returnDocument:'after'});
//         console.log("kk",user);
//         res.send('put user updated successfully');
//     }
//     catch(err){
//         console.log(err);
        
//         res.status(500).send('error in updating user '+err);
//     }
// });

connectDB.then(()=>{
    console.log('database connected successfully');
    app.listen(port,()=>{

        console.log(`server is running on port ${port}`);
    }); 
}).catch((err)=>{
    console.log('failed to connect to database',err);
}
);



