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

const fieldchecker=(updateData,ALLOWED_FIELDS)=>{
        const updateFields=Object.keys(updateData);
        //const newupdatedData=ALLOWED_FIELDS.reduce((acc,field)=>{if(updateFields.includes(field)){ acc[field]=updateData[field]; } return acc; },{});
        //console.log("newupdatedData",newupdatedData);
        const isValid=updateFields.every((field)=> ALLOWED_FIELDS.includes(field));
        const notallowed=updateFields.filter((field)=> !ALLOWED_FIELDS.includes(field)).join(',');
        return {isValid,notallowed};
}

module.exports={adminauth,userauth,fieldchecker};