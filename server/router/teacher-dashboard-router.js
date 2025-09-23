const express = require("express");
const router = express.Router();
const { teacherOnly } = require("../middlewares/role-middleware");
const authMiddleware = require("../middlewares/auth");
const {
  getTeacherFeedbacks,
  getTeacherStats,
  getTeacherProfile,
  updateTeacherProfile
} = require("../controllers/teacher-dashboard-controller");

// All teacher dashboard routes require authentication and teacher role
router.use(authMiddleware);
router.use(teacherOnly);

// Teacher profile management
router.get("/profile", getTeacherProfile);
router.put("/profile", updateTeacherProfile);

// Teacher feedbacks and stats
router.get("/feedbacks", getTeacherFeedbacks);
router.get("/stats", getTeacherStats);

module.exports = router;

