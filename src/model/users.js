const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        minlength:3,
        required:true
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate:{
        validator:function(value){
            return validator.isEmail(value);
        },
        message:'not a valid email'

    }
},
    password:{
        type:String,
        required:true,
        validate:{
            validator:function(value){
                return value.length>=6;
            },
            message:'password must be at least 6 characters long'
        }
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate:{
            validator:function(value){
                return ['male','female','other'].includes(value);
            },
            message:'not a valid gender'
        }
    },
    photourl:
    {
        type:String,
        validate:{
            validator:function(value){
                return validator.isURL(value); 
            },
            message:'not a valid url'
        }
    },
    skills:{
        type:[String],
        validate:{
            validator:function(value){
                return value.length<18;
            },
            message:'skills array must have less than 18 elements'
        }
    },
},
{timestamps:true});

userSchema.methods.comparePassword=async function (password){
    const user=this;//refers to the document on which this method is called
    console.log({user,password})
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
}

userSchema.methods.getJWT=function(){
    const user=this;
    const token=jwt.sign({id:user._id},'devnodejwtsecret',{expiresIn:'3m'});
    return token;
}

const User=mongoose.model('User',userSchema);

module.exports=User;