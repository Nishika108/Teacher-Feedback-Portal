const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
    }, 
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },  
    role:{
        type:String,
        enum:["admin","teacher","student"],
        default:"student",
    }
}
);
userSchema.pre("save",function(next){
    const user = this;
    if(!user.isModified("password")){
        return next();  
    }
    try{
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(user.password,salt);
        user.password = hashedPassword;
        next();
    }catch(error){
        next(error);
    }
});

userSchema.methods.comparePassword = async function(password){
    try{
        return await bcrypt.compare(password,this.password);
    }catch(error){
        console.log("Error in comparing password : ", error);   
    }
};

userSchema.methods.generateToken = async function(){
    try{
        return jwt.sign(
            {
                _id:this._id.toString(),
                email:this.email,
                role:this.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d",
            }
        );
    }catch(error){
        console.log("Error in generating token : ", error);   
    }
};
const User = mongoose.model("User",userSchema);
module.exports = User;