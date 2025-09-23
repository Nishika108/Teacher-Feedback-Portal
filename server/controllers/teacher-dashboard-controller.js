const Feedback = require("../models/feedback-model");
const Teacher = require("../models/teacher-model");
const User = require("../models/user-model");

// Get teacher's feedbacks with filtering options
const getTeacherFeedbacks = async (req, res) => {
  try {
    // First, find the teacher record using the user's email
    const teacher = await Teacher.findOne({ email: req.user.email });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher profile not found" });
    }
    
    const teacherId = teacher._id;
    const { 
      studentName, 
      rating, 
      startDate, 
      endDate, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    let filter = { teacherId };

    // Filter by rating
    if (rating) {
      filter.rating = parseInt(rating);
    }

    // Filter by date range
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    // Build aggregation pipeline
    let pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' }
    ];

    // Filter by student name
    if (studentName) {
      pipeline.push({
        $match: {
          'student.userName': { $regex: studentName, $options: 'i' }
        }
      });
    }

    // Add sorting
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    pipeline.push({ $sort: sortObj });

    // Add pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });

    // Get total count for pagination
    const countPipeline = pipeline.slice(0, -2); // Remove skip and limit
    countPipeline.push({ $count: 'total' });

    const [feedbacks, countResult] = await Promise.all([
      Feedback.aggregate(pipeline),
      Feedback.aggregate(countPipeline)
    ]);

    const total = countResult[0]?.total || 0;

    res.status(200).json({
      success: true,
      feedbacks,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error fetching teacher feedbacks:", error);
    res.status(500).json({ message: "Error fetching feedbacks" });
  }
};

// Get teacher dashboard statistics
const getTeacherStats = async (req, res) => {
  try {
    // First, find the teacher record using the user's email
    const teacher = await Teacher.findOne({ email: req.user.email });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher profile not found" });
    }
    
    const teacherId = teacher._id;

    // Get total feedbacks
    const totalFeedbacks = await Feedback.countDocuments({ teacherId });

    // Get average rating
    const avgRatingResult = await Feedback.aggregate([
      { $match: { teacherId } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    // Get rating distribution
    const ratingDistribution = await Feedback.aggregate([
      { $match: { teacherId } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Get recent feedbacks (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentFeedbacks = await Feedback.countDocuments({
      teacherId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get monthly feedback trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrend = await Feedback.aggregate([
      { 
        $match: { 
          teacherId,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalFeedbacks,
        averageRating: avgRatingResult[0]?.avgRating || 0,
        ratingDistribution,
        recentFeedbacks,
        monthlyTrend
      }
    });
  } catch (error) {
    console.error("Error fetching teacher stats:", error);
    res.status(500).json({ message: "Error fetching teacher statistics" });
  }
};

// Get teacher profile
const getTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const teacher = await Teacher.findOne({ email: req.user.email });
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher profile not found" });
    }
    
    res.status(200).json({ success: true, teacher });
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    res.status(500).json({ message: "Error fetching teacher profile" });
  }
};

// Update teacher profile
const updateTeacherProfile = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { fullName, phone, courses, department } = req.body;
    
    const teacher = await Teacher.findOneAndUpdate(
      { email: req.user.email },
      { fullName, phone, courses, department },
      { new: true }
    );
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher profile not found" });
    }
    
    res.status(200).json({ 
      success: true,
      message: "Teacher profile updated successfully", 
      teacher 
    });
  } catch (error) {
    console.error("Error updating teacher profile:", error);
    res.status(500).json({ message: "Error updating teacher profile" });
  }
};

module.exports = {
  getTeacherFeedbacks,
  getTeacherStats,
  getTeacherProfile,
  updateTeacherProfile
};

