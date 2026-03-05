const express=require('express')
const router=express.Router();
const {userauth}=require('../middlewares/auth');
const User=require('../model/users');
const {fieldchecker}=require('../middlewares/auth');
const bcrypt = require("bcrypt");

router.get("/getprofile", userauth, async (req, res) => {
  try {
    res.json({success:true,profile:req.user});
  } catch (err) {
    res.status(500).json({success:false,message:"error in fetching profile " + err});
  }
});

//patch method will update only the fields provided in the request body and keep the other fields unchanged*
router.post("/updateuser",userauth, async (req, res) => {
  try {
    const {_id:id}=req.user;
    const  updateData  = req.body;
    const ALLOWED_FIELDS = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "photourl",
      "skills",
    ];
    // let updateableFields=ALLOWED_FIELDS.reduce((acc, field)=>{
    //   if(updateData[field]) acc[field]=updateData[field];
    //   return acc;
    // }, {});

    const { isValid, notallowed } = fieldchecker(updateData, ALLOWED_FIELDS);
    if (!isValid)
      return res.status(400).json({ success: false, message: "invalid fields to update user data " + notallowed });
    const user = await User.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password -__v"); ;
    console.log("kk", user);
    res.json({ success: true, message: "user updated successfully", user });
  } catch (err) {
    res.status(500).json({success:false,message:"error in updating user " + err});
  }
});

router.patch("/changepassword", userauth, async (req, res) => {
  try {
    let loggedInUser=req.user;
    const  {oldpassword, ...updateData}  = req.body;
    console.log("updateData", updateData, oldpassword);
    const ALLOWED_FIELDS = ["password"];


    const { isValid, notallowed } = fieldchecker(updateData, ALLOWED_FIELDS);
    if(!isValid) return res.status(400).json({success:false,message:"invalid fields to update user data " + notallowed});
    const isMatch = await bcrypt.compare(oldpassword, req.user.password);

    if (!isMatch) return res.status(400).json({ success: false, message: "old password is incorrect" });
    if(updateData.password && updateData.password.length<6) return res.status(400).json({success:false,message:"password must be at least 6 characters long"});

    const passwordhash = await bcrypt.hash(updateData.password, 10);
    loggedInUser.password=passwordhash;
    await loggedInUser.save();
    res.json({success:true,message:"password changed successfully"});

  } catch (err) {
    res.status(500).json({success:false,message:"error in changing password " + err});
  }
});


module.exports=router;