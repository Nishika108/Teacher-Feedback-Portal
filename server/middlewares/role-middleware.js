const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const userRole = req.user.role;
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          message: "Access denied. Insufficient permissions.",
          requiredRoles: allowedRoles,
          userRole: userRole
        });
      }

      next();
    } catch (error) {
      console.error("Role middleware error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};

// Specific role middlewares
const adminOnly = roleMiddleware(['admin']);
const teacherOnly = roleMiddleware(['teacher']);
const adminOrTeacher = roleMiddleware(['admin', 'teacher']);
const studentOnly = roleMiddleware(['student']);

module.exports = {
  roleMiddleware,
  adminOnly,
  teacherOnly,
  adminOrTeacher,
  studentOnly
};

