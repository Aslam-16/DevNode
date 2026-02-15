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
      if (existinguser) throw new Error("email already exists");
    }

    if (!userdata.password) throw new Error("password is required");

    if (userdata.password && userdata.password.length < 6)
      throw new Error("password must be at least 6 characters long");

    const passwordhash = await bcrypt.hash(userdata.password, 10);
    const user = new User({ ...userdata, password: passwordhash });
    await user.save();
    res.send("user registered successfully");
  } catch (err) {
    res.status(500).send("error in user registration " + err);
  }
  console.log(req.body);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email) {
      if (!validator.isEmail(email)) throw new Error("not a valid email");
    }
    if (!email) throw new Error("email is required");
    if (!password) throw new Error("password is required");

    const user = await User.findOne({ email });

    if (!user) throw new Error("Invalid credentials");
    //through user schema method
    const isMatch = await user.comparePassword(password);

    if (!isMatch) throw new Error("Invalid credentials");

    const token = await user.getJWT();
    res.cookie("token", token);
    res.send("user logged in successfully");
  } catch (err) {
    res.status(500).send("error in user login " + err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("user logged out successfully");
});


module.exports=router;