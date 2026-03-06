const express = require('express');
const router=express.Router();
const User=require('../model/users');
const bcrypt = require("bcrypt");
const validator = require("validator");

router.post("/signup", async (req, res) => {
  const userdata = req.body;
  try {
    if (userdata.email) {
      if (!validator.isEmail(userdata.email))
        throw new Error("not a valid email");
      const existinguser = await User.findOne({ email: userdata.email });
      if (existinguser) return res.status(400).json({ success: false, message: "email already exist with this email id" });
    }

    if (!userdata.password) return res.status(400).json({ success: false, message: "password is required" });

    if (userdata.password && userdata.password.length < 6)
      return res.status(400).json({ success: false, message: "password must be at least 6 characters long" });

    const passwordhash = await bcrypt.hash(userdata.password, 10);
    const user = new User({ ...userdata, password: passwordhash });
    await user.save();
    res.json({ success: true, message: "user registered successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "error in user registration " + err });
  }
  console.log(req.body);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email) {
      if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "not a valid email" });
    }
    if (!email) return res.status(400).json({ success: false, message: "email is required" });
    if (!password) return res.status(400).json({ success: false, message: "password is required" });

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });
    //through user schema method
    const isMatch = await user.comparePassword(password);

    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = await user.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ success: true, message: "user logged in successfully", user: { firstName: user.firstName, email: user.email, id: user._id , lastName: user.lastName, age: user.age, gender: user.gender, skills: user.skills, photourl: user.photourl } });
  } catch (err) {
    res.status(500).json({ success: false, message: "error in user login " + err });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "user logged out successfully" });
});


module.exports=router;