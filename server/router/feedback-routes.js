const express = require("express");
const { addFeedback, getTeacherFeedback, getTeacherRating, getFeedbackByStudent } = require("../controllers/feedback-controller");
const authMiddleware = require("../middlewares/auth"); 
const router = express.Router();

router.post("/", authMiddleware, addFeedback);

router.get("/:studentId", getFeedbackByStudent);

router.get("/:teacherId", getTeacherFeedback);

router.get("/:teacherId/rating", getTeacherRating);

module.exports = router;
