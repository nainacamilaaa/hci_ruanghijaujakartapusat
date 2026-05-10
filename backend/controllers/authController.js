const { authenticateWithGoogle } = require("../services/authService");

/**
 * POST /api/auth/google
 * Body: { credential: "<Google ID Token>" }
 */
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential || typeof credential !== "string") {
      return res.status(400).json({
        success: false,
        message: "Google credential (ID token) is required.",
      });
    }

    const { user, token } = await authenticateWithGoogle(credential);

    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[googleLogin] Error:", err.message);

    // Google token verification failures
    if (
      err.message.includes("Token used too late") ||
      err.message.includes("Invalid token")
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Google token. Please try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication failed. Please try again.",
    });
  }
};

/**
 * GET /api/auth/me
 * Returns current authenticated user info.
 * Protected: requires authMiddleware
 */
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
    });
  } catch (err) {
    console.error("[getMe] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user profile.",
    });
  }
};

module.exports = { googleLogin, getMe };