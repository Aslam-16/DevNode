const express=require('express');
const app=express();
const port=1616;


// app.use('/test',(req,res)=>{
//     res.send('Hello from DevNode server!');
// })

// app.get(/ab+c/,(req,res)=>{
//     res.send(`from get /route ${req.url}`);
// });
app.get('/',(req,res)=>{
    res.send(`from get route ${req.url}`);
})

app.get('/user',(req,res)=>{
    console.log(req.query);
    
    res.send(`from get route ${req.url}`);
})

app.post('/',(req,res)=>{
    let user={
        name:'aslam'
    }
    res.send(user);
})
//always keep it in the end due to its hierarchy issue and order of routes matters a lot
app.use('/',(req,res,next)=>{
    res.send('from / route');
})

app.listen(port,()=>{
    console.log(`DevNode server is running at http://localhost:${port}`);
});