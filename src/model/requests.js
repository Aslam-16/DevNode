const mongoose=require('mongoose');

const requestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    status:{
        type:String,
        enum:["interested","ignored","accepted","rejected"],
        message:"status can only be interested, ignored, accepted or rejected",
        required:true
    }
},{timestamps:true});

const Request=mongoose.model('Request',requestSchema);

module.exports=Request;