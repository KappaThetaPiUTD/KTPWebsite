import { v2 as cloudinary } from "cloudinary";

// Cloudinary's API secret must never be committed to GitHub. Set these values
// in the local .env file (for scripts) or in the hosting provider's environment
// settings (for server-side usage).
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;