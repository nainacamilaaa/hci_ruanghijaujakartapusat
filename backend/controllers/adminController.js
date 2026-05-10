const Park = require("../models/Park");
const Event = require("../models/Event");
const User = require("../models/User");

/**
 * GET /api/admin/stats
 * Returns aggregate counts for the admin dashboard.
 */
const getDashboardStats = async (req, res) => {
  try {
    const [totalParks, totalEvents, totalUsers] = await Promise.all([
      Park.countDocuments(),
      Event.countDocuments(),
      User.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalParks,
        totalEvents,
        totalUsers,
      },
    });
  } catch (err) {
    console.error("[getDashboardStats] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats.",
    });
  }
};

/**
 * GET /api/admin/users
 * Returns paginated user list for admin management.
 */
const getUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[getUsers] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
};

/**
 * PATCH /api/admin/users/:id/role
 * Promote or demote a user's role.
 */
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either 'user' or 'admin'.",
      });
    }

    // Prevent self-demotion
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role.",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role}.`,
      user,
    });
  } catch (err) {
    console.error("[updateUserRole] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update user role.",
    });
  }
};

module.exports = { getDashboardStats, getUsers, updateUserRole };