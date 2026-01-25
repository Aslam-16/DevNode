const adminauth=(req,res,next)=>{
    let user='admin';
    if(user==='adminn'){
        next();
    }
    else{
        res.send('unauthorized user');
    }
}

const userauth=(req,res,next)=>{
    let user='user';
    if(user==='usere'){
        next();
    }
    else{
        res.send('unauthorized user');
    }
}

module.exports={adminauth,userauth};