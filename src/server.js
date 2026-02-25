require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const { adminauth, userauth, fieldchecker } = require("./middlewares/auth");
const User = require("./model/users");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const port = process.env.PORT;

// CORS Configuration - Allow frontend to access backend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
//to parse json data in request body and allow any post request
// to accept the incoming req body as json data and make it available in req.body for further processing in the route handlers
app.use(express.json());
//to log the incoming requests and their details in the console for debugging and monitoring purposes
app.use(morgan("dev"));
//to limit the number of requests from a single IP address to prevent brute force attacks and DDoS attacks
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

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
