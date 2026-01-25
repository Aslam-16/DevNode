const express=require('express');
const app=express();
const port=1616;
const {adminauth,userauth}=require('./middlewares/auth');


// app.use('/test',(req,res)=>{
//     res.send('Hello from DevNode server!');
// })

// app.get(/ab+c/,(req,res)=>{
//     res.send(`from get /route ${req.url}`);
// });
app.use('/admin',adminauth);
//app.use('/user',userauth);

app.get('/admin/home',(req,res)=>{
    res.send('from admin home');
});

app.get('/user/home',userauth,(req,res)=>{
    res.send('from user home');
});

app.listen(port,()=>{
    console.log(`DevNode server is running at http://localhost:${port}`);
});

