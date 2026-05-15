const { uploadToCloudinary } = require("../services/cloudinaryService");

/**
 * POST /api/upload
 * Body: multipart/form-data dengan field "image"
 * Query: ?folder=parks atau ?folder=events
 */
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Tidak ada file yang diupload." });
    }

    const folder = `ruanghijau/${req.query.folder || "general"}`;
    const { url, publicId } = await uploadToCloudinary(req.file.buffer, folder);

    res.status(200).json({
      message: "Upload berhasil.",
      url,
      publicId,
    });
  } catch (err) {
    console.error("Upload error:", err.message);

    // Error dari multer (ukuran file, format)
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Ukuran file maksimal 5MB." });
    }

    res.status(500).json({ message: err.message || "Gagal upload gambar." });
  }
};

module.exports = { uploadImage };