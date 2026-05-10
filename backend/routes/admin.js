const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  updateUserRole,
} = require("../controllers/adminController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// Apply both middlewares to ALL admin routes
router.use(authMiddleware, adminMiddleware);

// GET /api/admin/stats
router.get("/stats", getDashboardStats);

// GET /api/admin/users
router.get("/users", getUsers);

// PATCH /api/admin/users/:id/role
router.patch("/users/:id/role", updateUserRole);

module.exports = router;