// Converts a Cloudinary delivery URL for browser display only. The original
// upload remains unchanged and should still be used for evidentiary download.
export function cloudinaryDisplayUrl(originalUrl) {
  if (typeof originalUrl !== "string") return originalUrl;
  const marker = "/image/upload/";
  if (!originalUrl.includes("res.cloudinary.com") || !originalUrl.includes(marker)) {
    return originalUrl;
  }
  return originalUrl.replace(marker, `${marker}f_auto,q_auto/`);
}
