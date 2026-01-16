const express=require('express');
const app=express();
const port=1616;


// app.use('/test',(req,res)=>{
//     res.send('Hello from DevNode server!');
// })

// app.get(/ab+c/,(req,res)=>{
//     res.send(`from get /route ${req.url}`);
// });
app.get('/',(req,res,next)=>{
    next();
    console.log('This is the first middleware.');
},
(req,res,next)=>{
    next();
    console.log('This is the second middleware.');
        
},
(req,res,next)=>{
    console.log('This is the third middleware.');
    //next();
    res.send('hi there, welcome to DevNode server!');
});

app.listen(port,()=>{
    console.log(`DevNode server is running at http://localhost:${port}`);
});