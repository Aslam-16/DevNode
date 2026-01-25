const adminauth=(req,res,next)=>{
    let user='admin';
    if(user==='admin'){
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