const express = require("express");
const app = express();
const port = 1616;
const connectDB = require("./config/db");
const { adminauth, userauth, fieldchecker } = require("./middlewares/auth");
const User = require("./model/users");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
//to parse json data in request body and allow any post request
// to accept the incoming req body

app.use(express.json());

app.use("/", require("./routers/authrouter"));
app.use("/", require("./routers/profilerouter"));
app.use("/", require("./routers/requestrouter"));

app.get("/listusers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(500).send("error in fetching users");
  }
});

app.delete("/deleteuser", async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findByIdAndDelete(id, (returnDocument = "after"));
    console.log("kk", user);
    res.send("user deleted successfully");
  } catch (err) {
    res.status(500).send("error in deleting user");
  }
});

//put method will replace the entire document with the new data provided in the request body
// app.put('/updateuser',async(req,res)=>{
//     try{

//         const {id,...updateData}=req.body;
//         const ALLOWED_FIELDS=['firstname','lastname','age','gender','photourl','skills'];
//         const updateFields=Object.keys(updateData);
//         const isValid=updateFields.every((field)=> ALLOWED_FIELDS.includes(field));
//         if(!isValid) throw new Error('invalid fields in update data');
//         const user=await User.findOneAndReplace({_id:id},updateData,{returnDocument:'after'});
//         console.log("kk",user);
//         res.send('put user updated successfully');
//     }
//     catch(err){
//         console.log(err);

//         res.status(500).send('error in updating user '+err);
//     }
// });

connectDB
  .then(() => {
    console.log("database connected successfully");
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("failed to connect to database", err);
  });
