const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

const home = async (req, res) => {
    try{
        res
        .status(200)
        .send("Welcome to Teacher Portal! by router");
    }
    catch(error){
        console.log(error);
        
    }
};
const register = async (req, res,next) => {
    try{
        const {userName,email,phone,password,role} = req.body;
        console.log(req.body);
        const UserExists = await User.findOne({email});
        if(UserExists){
            return res.status(400).json({message:"User already exists"});
        }
        const userCreated = await User.create({userName,email,phone,password, role});
        res.status(201).json({message:"User registered successfully", token: await userCreated.generateToken(), UserId : userCreated._id.toString()});
    }
    catch(error){
        next(error);
        
    }
};

//user login controller
const login = async (req, res) => {
    try{
        const {email,password} = req.body;
        const UserExists = await User.findOne({email});
        if(!UserExists){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const user = await UserExists.comparePassword(password);
        if(user){
            res.status(201).json({
                message:"login successful", 
                token: await UserExists.generateToken(), 
                UserId : UserExists._id.toString(),
                userData: {
                    _id: UserExists._id,
                    userName: UserExists.userName,
                    email: UserExists.email,
                    role: UserExists.role
                }
            });
        }
        else{
            res.status(401).json({message:"Invalid credentials"});
        }
    }
    catch(error){
        console.log(error);
        
    }
};
// User details controller
const user = async (req, res) => {
    try{
        const userData = req.user;
        console.log(userData);
        res.status(200).json({userData});
    }
    catch(error){
        console.log(error);
        
    }
};
module.exports = {home,register,login,user};