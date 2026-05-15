const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadImage } = require("../controllers/uploadController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

// POST /api/upload?folder=parks
// Hanya admin yang boleh upload
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"), // field name harus "image"
  uploadImage
);

module.exports = router;