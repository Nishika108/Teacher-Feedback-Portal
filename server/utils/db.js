const mongoose = require("mongoose");
const URI = process.env.MONGODB_URI;
const connectDb = async()=>{
    try{
        await mongoose.connect(URI);
        console.log("Database connected successfully");
    }
    catch(error){
        console.log("Error while connecting to database",error);
        process.exit(0);
    }
}
module.exports = connectDb;