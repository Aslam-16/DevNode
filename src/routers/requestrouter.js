const express = require('express');
const mongoose = require('mongoose');
const { userauth } = require('../middlewares/auth');
const router = express.Router();
const User = require('../model/users');
const Request=require('../model/requests');


router.post('/connectionrequest/:status/:userId', userauth,async(req,res)=>{

    try{
        const status=req.params.status;
        const userId=req.params.userId;
        const ALLOWED_STATUS=["interested","ignored"];
        if(!ALLOWED_STATUS.includes(status)) return res.json({success:false,message:"invalid status "+status});
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.json({success:false,message:"invalid user id format"});
        if(userId===req.user._id.toString()) return res.json({success:false,message:"you cannot send connection request to yourself"});
        const isuserexist=await User.findById(userId);
        console.log("isuserexist",isuserexist);
        if(!isuserexist) return res.json({success:false,message:"user not found with id "+userId});
        const isrequestalreadyexist=await Request.findOne({$or:[{fromUserId:req.user._id,toUserId:userId},{fromUserId:userId,toUserId:req.user._id}]});
        if(isrequestalreadyexist) return res.json({success:false,message:"request already exist with this user"});
        const request=new Request({fromUserId:req.user._id,toUserId:userId,status});
        await request.save();
        res.json({success:true,message:"connection request sent successfully",request});
    }
    catch(err){
        res.status(500).json({success:false,message:"error in sending connection request "+err});
    }
})

router.post('/respondtorequest/:requestId/:status', userauth,async(req,res)=>{
    try {
        const requestId=req.params.requestId;
        const status=req.params.status;
        const ALLOWED_STATUS=["accepted","rejected"];
        if(!ALLOWED_STATUS.includes(status)) return res.json({success:false,message:"invalid status "+status});
        if(!mongoose.Types.ObjectId.isValid(requestId)) return res.json({success:false,message:"invalid request id format"});
        const requestInfo=await Request.findOne({_id:requestId,status:"interested"});
        if(!requestInfo) return res.json({success:false,message:"request not found with id "+requestId});
        if(requestInfo.toUserId.toString()!==req.user._id.toString()) return res.json({success:false,message:"you are not authorized to update this request"});
        if(requestInfo.status===status) return res.json({success:false,message:"request is already updated to  "+status});
        requestInfo.status=status;
        await requestInfo.save();
        res.json({success:true,message:"request updated successfully",requestInfo});

    } catch (error) {
        res.status(500).json({success:false,message:"error in updating request "+error});
    }
});

router.get('/connection/requestreceived', userauth,async(req,res)=>{
    try {
        const requests=await Request.find({toUserId:req.user._id,status:"interested"}).populate("fromUserId","firstName lastName photourl skills gender age");
        res.json({success:true,requests});
    } catch (error) {
        res.status(500).json({success:false,message:"error in getting request received "+error});
    }
});

router.get('/connection/requestsent', userauth,async(req,res)=>{
    try {
        const requests=await Request.find({fromUserId:req.user._id,status:"interested"}).populate("toUserId","firstName email");
        res.json({success:true,requests});
    } catch (error) {
        res.status(500).json({success:false,message:"error in getting request sent "+error});
    }
});

router.get('/connections', userauth,async(req,res)=>{
    try{
        const connections=await Request.find({fromUserId:req.user._id,status:"accepted"}).populate("toUserId","firstName lastName gender age skills photourl");
        const connections2=await Request.find({toUserId:req.user._id,status:"accepted"}).populate("fromUserId","firstName lastName gender age skills photourl");
        const allConnections=[...connections,...connections2];
        if(allConnections.length===0) return res.json({success:false,message:"no connections found"});
        let data=allConnections.map((connection)=>{
            if(connection.toUserId.toString()==req.user._id.toString()){
                return connection.fromUserId
            }
            else return connection.toUserId
        }
        )
        res.json({success:true,connections:data});
    }
    catch(error){
        res.status(500).json({success:false,message:"error in getting connections "+error});
    }
});

router.get('/feed',userauth,async (req,res)=>{
    try{
        let page=parseInt(req.query.page)||1
        let limit=parseInt(req.query.limit)||10
        let skip=(page-1)*limit
        const connections=await Request.find({$or:[{fromUserId:req.user._id},{toUserId:req.user._id}]}).select("fromUserId toUserId").lean();
        const hideUsers=new Set();
        hideUsers.add(req.user._id.toString());
        connections.forEach((connection)=>{
            hideUsers.add(connection.fromUserId.toString());
            hideUsers.add(connection.toUserId.toString());
        });
        const feedUsers=await User.find({_id:{$nin:Array.from(hideUsers)}}).select("firstName lastname email photourl age gender skills _id").skip(skip).limit(limit);
        res.json({success:true,feed:feedUsers});
    }
    catch(error){
        res.status(500).json({success:false,message:"error in getting feed "+error});
    }
});

module.exports = router;