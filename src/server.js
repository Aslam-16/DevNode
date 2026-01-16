const express=require('express');
const app=express();
const port=1616;

app.use('/test',(req,res)=>{
    res.send('Hello from DevNode server!');
})

app.listen(port,()=>{
    console.log(`DevNode server is running at http://localhost:${port}`);
});