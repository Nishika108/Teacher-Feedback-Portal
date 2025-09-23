const express = require("express");
const router = express.Router();
const { adminOnly } = require("../middlewares/role-middleware");
const authMiddleware = require("../middlewares/auth");
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  createUser,
  getDashboardStats,
  getAllFeedbacks,
  generateSummaryReport
} = require("../controllers/admin-dashboard-controller");

// All admin dashboard routes require authentication and admin role
router.use(authMiddleware);
router.use(adminOnly);

// Dashboard stats
router.get("/dashboard/stats", getDashboardStats);

// User management
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.get("/users/:userId", getUserById);
router.put("/users/:userId/role", updateUserRole);
router.delete("/users/:userId", deleteUser);

// Feedback management
router.get("/feedbacks", getAllFeedbacks);

// Reports
router.get("/reports/summary", generateSummaryReport);

module.exports = router;

