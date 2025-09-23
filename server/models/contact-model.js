const {Schema, model} = require("mongoose");
const contactSchema = new Schema({
    userName:{ type:String, required:true },
    email:{ type:String, required:true },
    message:{ type:String, required:true },
});

const Contact = new model("Contact",contactSchema);  
module.exports = model("Contact",contactSchema);