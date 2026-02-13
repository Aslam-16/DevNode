const jwt = require("jsonwebtoken");
const User = require("../model/users");
const adminauth=(req,res,next)=>{
    let user='admin';
    if(user==='adminn'){
        next();
    }
    else{
        res.send('unauthorized user');
    }
}

const userauth=async(req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token) throw new Error('unauthorized user');
        const decoded=jwt.verify(token,'devnodejwtsecret');
        const user=await User.findById(decoded.id);
        if(!user) throw new Error('user not found');
        req.user=user;
        //res.send("from user auth middleware");

        next();
    }catch(err){
        res.status(500).send("error in user authentication "+err);
    }
}

const fieldchecker=(updateData,ALLOWED_FIELDS)=>{
        const updateFields=Object.keys(updateData);
        //const newupdatedData=ALLOWED_FIELDS.reduce((acc,field)=>{if(updateFields.includes(field)){ acc[field]=updateData[field]; } return acc; },{});
        //console.log("newupdatedData",newupdatedData);
        const isValid=updateFields.every((field)=> ALLOWED_FIELDS.includes(field));
        const notallowed=updateFields.filter((field)=> !ALLOWED_FIELDS.includes(field)).join(',');
        return {isValid,notallowed};
}

module.exports={adminauth,userauth,fieldchecker};