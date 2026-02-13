const express = require("express");
const app = express();
const port = 1616;
const connectDB = require("./config/db");
const { adminauth, userauth, fieldchecker } = require("./middlewares/auth");
const User = require("./model/users");
const bcrypt = require("bcrypt");
const validator = require("validator");
//to parse json data in request body and allow any post request
// to accept the incoming req body

app.use(express.json());

app.use("/", (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use("/admin", adminauth);
//app.use('/user',userauth);

app.get("/admin/home", (req, res) => {
  res.send("from admin home");
});

app.get("/user/home", userauth, (req, res) => {
  res.send("from user home");
});

app.post("/signup", async (req, res) => {
  const userdata = req.body;
  try {
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email) {
      if (!validator.isEmail(email)) throw new Error("not a valid email");
    }
    if (!email) throw new Error("email is required");
    if (!password) throw new Error("password is required");
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");
    res.send("user logged in successfully");
  } catch (err) {
    res.status(500).send("error in user login " + err);
  }
});

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
//patch method will update only the fields provided in the request body and keep the other fields unchanged*
app.patch("/updateuser", async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const ALLOWED_FIELDS = [
      "firstname",
      "lastname",
      "age",
      "gender",
      "photourl",
      "skills",
    ];

    const { isValid, notallowed } = fieldchecker(updateData, ALLOWED_FIELDS);
    if (!isValid)
      throw new Error("invalid fields to update data " + notallowed);
    const user = await User.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log("kk", user);
    res.send("user updated successfully");
  } catch (err) {
    res.status(500).send("error in updating user " + err);
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
