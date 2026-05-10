const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify Google ID token and return payload.
 * @param {string} idToken - Token from Google Identity Services (frontend)
 */
const verifyGoogleToken = async (idToken) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error("Invalid Google token payload");
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    avatar: payload.picture,
    emailVerified: payload.email_verified,
  };
};

/**
 * Find existing user or create a new one.
 * @param {object} googleUser - Extracted from Google token
 */
const findOrCreateUser = async (googleUser) => {
  const { googleId, email, name, avatar } = googleUser;

  let user = await User.findOne({ googleId });

  if (!user) {
    // Also check by email in case they previously used a different auth method
    user = await User.findOne({ email });

    if (user) {
      // Link existing email account with Google
      user.googleId = googleId;
      user.avatar = avatar;
      await user.save();
    } else {
      // Brand new user
      user = await User.create({
        googleId,
        email,
        name,
        avatar,
        role: "user", // Default role
      });
    }
  } else {
    // Update avatar in case Google profile picture changed
    if (user.avatar !== avatar) {
      user.avatar = avatar;
      await user.save();
    }
  }

  return user;
};

/**
 * Generate a signed JWT for a user.
 * @param {object} user - Mongoose User document
 */
const generateJWT = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    issuer: "ruang-hijau-jakarta",
  });
};

/**
 * Main auth service: verify token → find/create user → issue JWT
 */
const authenticateWithGoogle = async (idToken) => {
  if (!idToken) {
    throw new Error("Google ID token is required");
  }

  const googleUser = await verifyGoogleToken(idToken);

  if (!googleUser.emailVerified) {
    throw new Error("Google account email is not verified");
  }

  const user = await findOrCreateUser(googleUser);
  const token = generateJWT(user);

  return { user, token };
};

module.exports = { authenticateWithGoogle };