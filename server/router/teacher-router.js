const express = require("express");
const router = express.Router();
const { teacherForm, getAllTeachers, getTeacherById } = require("../controllers/teacher-controller");

// Add teacher
router.post("/add", teacherForm);

// Get all teachers
router.get("/all", getAllTeachers);

// Get teacher by ID
router.get("/:id", getTeacherById);

module.exports = router;
