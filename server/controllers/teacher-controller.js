const Teacher = require("../models/teacher-model");

// Add new teacher
const teacherForm = async (req, res, next) => {
  try {
    const { fullName, email, phone, courses, department, employeeId, role, joiningDate } = req.body;

    if (!fullName || !email || !phone || !courses || !department || !employeeId) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const existingTeacher = await Teacher.findOne({ $or: [{ email }, { employeeId }] });
    if (existingTeacher) {
      return res.status(409).json({ message: "Teacher with this email or employeeId already exists" });
    }

    const teacherCreated = await Teacher.create({
      fullName,
      email,
      phone,
      courses,
      department,
      employeeId,
      role,
      joiningDate,
    });

    res.status(201).json({
      message: "Teacher form submitted successfully",
      teacher: {
        id: teacherCreated._id,
        fullName: teacherCreated.fullName,
        email: teacherCreated.email,
      },
    });
  } catch (error) {
    console.error("Error in teacherForm:", error);
    res.status(500).json({ message: "Server error while submitting teacher form" });
  }
};

// Get all teachers
const getAllTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    console.error("Error in getAllTeachers:", error);
    res.status(500).json({ message: "Server error while fetching teachers" });
  }
};

// Get teacher by ID
const getTeacherById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error("Error in getTeacherById:", error);
    res.status(500).json({ message: "Server error while fetching teacher" });
  }
};

module.exports = { teacherForm, getAllTeachers, getTeacherById };
