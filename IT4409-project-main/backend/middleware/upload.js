import multer from 'multer';

export const PRODUCT_IMAGE_MAX_FILE_SIZE = 5 * 1024 * 1024;
export const PRODUCT_IMAGE_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: PRODUCT_IMAGE_MAX_FILE_SIZE,
    files: 6,
  },
  fileFilter: (req, file, cb) => {
    if (PRODUCT_IMAGE_ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
      return;
    }

    const error = new Error("Only JPG, PNG, and WebP images are allowed.");
    error.code = "UNSUPPORTED_IMAGE_TYPE";
    cb(error);
  },
});

export default upload;
