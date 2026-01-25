const mongoose=require('mongoose');

const connectDB= mongoose.connect('mongodb+srv://aslam16:aslam16@nodecluster.kimhn41.mongodb.net/DevNode')




module.exports=connectDB;