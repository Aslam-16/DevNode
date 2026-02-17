const express = require('express');
const mongoose = require('mongoose');
const { userauth } = require('../middlewares/auth');
const router = express.Router();
const User = require('../model/users');
const Request=require('../model/requests');

router.get('/feed', (req, res) => {
    res.send("this is the feed page");
});

router.post('/connectionrequest/:status/:userId', userauth,async(req,res)=>{

    try{
        const status=req.params.status;
        const userId=req.params.userId;
        const ALLOWED_STATUS=["interested","ignored"];
        if(!ALLOWED_STATUS.includes(status)) throw new Error("invalid status "+status);
        if(!mongoose.Types.ObjectId.isValid(userId)) throw new Error("invalid user id format");
        if(userId===req.user._id.toString()) throw new Error("you cannot send connection request to yourself");
        const isuserexist=await User.findById(userId);
        console.log("isuserexist",isuserexist);
        if(!isuserexist) throw new Error("user not found with id "+userId);
        const isrequestalreadyexist=await Request.findOne({$or:[{fromUserId:req.user._id,toUserId:userId},{fromUserId:userId,toUserId:req.user._id}]});
        if(isrequestalreadyexist) throw new Error("request already exist with this user");
        const request=new Request({fromUserId:req.user._id,toUserId:userId,status});
        await request.save();
        res.send("connection request sent successfully", request);
    }
    catch(err){
        res.status(500).send("error in sending connection request "+err);
    }
})

router.post('/respondtorequest/:requestId/:status', userauth,async(req,res)=>{
    try {
        const requestId=req.params.requestId;
        const status=req.params.status;
        const ALLOWED_STATUS=["accepted","rejected"];
        if(!ALLOWED_STATUS.includes(status)) throw new Error("invalid status "+status);
        if(!mongoose.Types.ObjectId.isValid(requestId)) throw new Error("invalid request id format");
        const requestInfo=await Request.findOne({_id:requestId,status:"interested"});
        if(!requestInfo) throw new Error("request not found with id "+requestId);
        if(requestInfo.toUserId.toString()!==req.user._id.toString()) throw new Error("you are not authorized to update this request");
        if(requestInfo.status===status) throw new Error("request is already updated to  "+status);
        requestInfo.status=status;
        await requestInfo.save();
        res.send("request updated successfully", requestInfo);

    } catch (error) {
        res.status(500).send("error in updating request "+error);
    }
});

router.get('/connection/requestreceived', userauth,async(req,res)=>{
    try {
        const requests=await Request.find({toUserId:req.user._id,status:"interested"}).populate("fromUserId");
        res.send(requests);
    } catch (error) {
        res.status(500).send("error in getting request received "+error);
    }
});

router.get('/connections', userauth,async(req,res)=>{
    try{
        const connections=await Request.find({$or:[{fromUserId:req.user._id,status:"accepted"},{toUserId:req.user._id,status:"accepted"}]}).populate("fromUserId","firstName email").populate("toUserId","firstName email");
        if(connections.length===0) throw new Error("no connections found");
        res.send(connections);
    }
    catch(error){
        res.status(500).send("error in getting connections "+error);
    }
});

module.exports = router;