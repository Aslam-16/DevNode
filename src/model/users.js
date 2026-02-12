const mongoose=require('mongoose');
const validator=require('validator');

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

const User=mongoose.model('User',userSchema);

module.exports=User;