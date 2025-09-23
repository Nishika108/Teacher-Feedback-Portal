const User = require("../models/user-model");
const Teacher = require("../models/teacher-model");
const Feedback = require("../models/feedback-model");

// Get all users with pagination and filtering
const getAllUsers = async (req, res) => {
  try {
    const { 
      role, 
      search, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    let filter = {};
    
    if (role) {
      filter.role = role;
    }
    
    if (search) {
      filter.$or = [
        { userName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(filter)
      .select('-password')
      .sort(sortObj)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

// Update user role
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    const allowedRoles = ['admin', 'teacher', 'student'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    
    // Prevent admin from changing their own role
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ 
      success: true,
      message: "User role updated successfully", 
      user 
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Error updating user role" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ 
      success: true,
      message: "User deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { userName, email, phone, password, role } = req.body;
    
    // Validate required fields
    if (!userName || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }, { userName }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: "User with this email, phone, or username already exists" });
    }
    
    // Hash password
    const bcrypt = require("bcryptjs");
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    // Create user
    const user = await User.create({
      userName,
      email,
      phone,
      password: hashedPassword,
      role
    });
    
    res.status(201).json({ 
      success: true,
      message: "User created successfully", 
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalFeedbacks = await Feedback.countDocuments();
    const totalTeachersInDirectory = await Teacher.countDocuments();
    
    // Recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    
    // Recent feedbacks (last 7 days)
    const recentFeedbacks = await Feedback.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Average rating across all teachers
    const avgRatingResult = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalTeachers,
        totalStudents,
        totalAdmins,
        totalFeedbacks,
        totalTeachersInDirectory,
        recentUsers,
        recentFeedbacks,
        averageRating: avgRatingResult[0]?.avgRating || 0
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Error fetching dashboard statistics" });
  }
};

// Get all feedbacks with filtering
const getAllFeedbacks = async (req, res) => {
  try {
    const { 
      teacherId, 
      studentId, 
      rating, 
      startDate, 
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    let filter = {};
    
    if (teacherId) filter.teacherId = teacherId;
    if (studentId) filter.studentId = studentId;
    if (rating) filter.rating = parseInt(rating);
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const feedbacks = await Feedback.find(filter)
      .populate('studentId', 'userName email')
      .populate('teacherId', 'fullName email department')
      .sort(sortObj)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Feedback.countDocuments(filter);

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
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Error fetching feedbacks" });
  }
};

// Generate summary reports
const generateSummaryReport = async (req, res) => {
  try {
    const { startDate, endDate, teacherId } = req.query;
    
    // Build date filter
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Add teacher filter if specified
    if (teacherId) {
      dateFilter.teacherId = teacherId;
    }

    // Get feedback statistics
    const feedbackStats = await Feedback.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalFeedbacks: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          minRating: { $min: "$rating" },
          maxRating: { $max: "$rating" }
        }
      }
    ]);

    // Get rating distribution
    const ratingDistribution = await Feedback.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Get top rated teachers
    const topTeachers = await Feedback.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$teacherId",
          averageRating: { $avg: "$rating" },
          totalFeedbacks: { $sum: 1 }
        }
      },
      { $sort: { averageRating: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'teachers',
          localField: '_id',
          foreignField: '_id',
          as: 'teacher'
        }
      },
      { $unwind: '$teacher' }
    ]);

    // Get monthly trends
    const monthlyTrend = await Feedback.aggregate([
      { $match: dateFilter },
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
      report: {
        period: {
          startDate: startDate || 'All time',
          endDate: endDate || 'Present'
        },
        statistics: feedbackStats[0] || {
          totalFeedbacks: 0,
          averageRating: 0,
          minRating: 0,
          maxRating: 0
        },
        ratingDistribution,
        topTeachers,
        monthlyTrend
      }
    });
  } catch (error) {
    console.error("Error generating summary report:", error);
    res.status(500).json({ message: "Error generating summary report" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  createUser,
  getDashboardStats,
  getAllFeedbacks,
  generateSummaryReport
};

