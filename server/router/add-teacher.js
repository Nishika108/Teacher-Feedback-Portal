const express = require("express");
const router = express.Router();
const { teacherForm } = require("../controllers/teacher-controller");
router.route("/addTeacher").post(teacherForm);

module.exports = router; 