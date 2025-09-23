const mongoose = require("mongoose");
const Feedback = require("../models/feedback-model");
const Teacher = require("../models/teacher-model");

// 📌 Add Feedback
const addFeedback = async (req, res) => {
  try {
    const { teacherId, rating, comments } = req.body;
    const studentId = req.user._id; // ✅ requires auth middleware

    if (!teacherId || !rating) {
      return res.status(400).json({ success: false, message: "Teacher ID and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    const existingFeedback = await Feedback.findOne({ studentId, teacherId });
    if (existingFeedback) {
      return res.status(409).json({ success: false, message: "You have already given feedback to this teacher" });
    }

    const feedback = await Feedback.create({
      studentId,
      teacherId,
      rating,
      comments,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Error in addFeedback:", error);
    res.status(500).json({ success: false, message: "Server error while adding feedback" });
  }
};
// 📌 Get feedbacks by student ID
const getFeedbackByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const feedbacks = await Feedback.find({
      studentId: new mongoose.Types.ObjectId(studentId),
    }).populate("teacherId", "empId fullName"); 

    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Error fetching feedbacks" });
  }
};


// 📌 Get all feedback for a teacher
const getTeacherFeedback = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const feedbacks = await Feedback.find({ teacherId })
      .populate("studentId", "userName email")
      .sort({ createdAt: -1 });

    if (feedbacks.length === 0) {
      return res.status(404).json({ success: false, message: "No feedback found for this teacher" });
    }

    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    console.error("Error in getTeacherFeedback:", error);
    res.status(500).json({ success: false, message: "Server error while fetching feedback" });
  }
};

// 📌 Get average rating for a teacher
const getTeacherRating = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const result = await Feedback.aggregate([
      { $match: { teacherId: new mongoose.Types.ObjectId(teacherId) } },
      { $group: { _id: "$teacherId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "No feedback found for this teacher" });
    }

    res.status(200).json({
      success: true,
      teacherId,
      averageRating: result[0].avgRating.toFixed(2),
      totalFeedbacks: result[0].count,
    });
  } catch (error) {
    console.error("Error in getTeacherRating:", error);
    res.status(500).json({ success: false, message: "Server error while calculating rating" });
  }
};

module.exports = {
  addFeedback,
  getTeacherFeedback,
  getTeacherRating,
  getFeedbackByStudent,
};
