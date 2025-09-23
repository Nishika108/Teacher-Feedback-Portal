const { Schema, model } = require("mongoose");

const teacherSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,   
  },
  phone: {
    type: String,
    required: true,
  },
  courses: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,   
  },
  role: {
    type: String,
    enum: ["Teacher", "HOD", "Admin"],
    default: "Teacher",
  },
  joiningDate: {
    type: Date,
    default: Date.now, 
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Teacher = model("Teacher", teacherSchema);
module.exports = Teacher;
