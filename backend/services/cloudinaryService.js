const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload buffer ke Cloudinary via stream
 * @param {Buffer} buffer - file buffer dari multer
 * @param {string} folder - folder tujuan di Cloudinary (e.g. "parks", "events")
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadToCloudinary = (buffer, folder = "ruanghijau") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { width: 1200, height: 800, crop: "limit" }, // batas ukuran max
          { quality: "auto:good" },                     // kompresi otomatis
          { fetch_format: "auto" },                     // format optimal (webp, dll)
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    // Konversi buffer ke readable stream lalu pipe ke cloudinary
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

/**
 * Hapus gambar dari Cloudinary berdasarkan publicId
 * @param {string} publicId
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Gagal hapus gambar dari Cloudinary:", err.message);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };