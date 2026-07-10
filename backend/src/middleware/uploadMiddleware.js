const multer = require('multer');

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;    // 8MB per image
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;  // 100MB per video — adjust to match your Cloudinary plan's per-file limit

// Memory storage: files arrive as buffers in req.file/req.files, never touch
// disk. Nothing to clean up after the request completes — the buffer is
// garbage collected once the response is sent, so there's no orphaned-temp-file
// failure mode to guard against even if the process crashes mid-request.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
  if (!allowed.includes(file.mimetype)) {
    return cb(Object.assign(
      new Error(`Unsupported file type: ${file.mimetype}`),
      { statusCode: 400 }
    ));
  }
  cb(null, true);
};

// Multer enforces a single global fileSize limit per instance. Since one
// request can carry both an image field (e.g. thumbnail) and a video field
// with different acceptable sizes, the limit here is set to the larger
// ceiling, and validateAssetSize() below re-checks the smaller per-field
// limit (e.g. image) after Multer has already buffered the file.
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_VIDEO_BYTES },
});

/**
 * Re-validates a single uploaded file against a stricter per-field size limit
 * than the multer instance's global ceiling. Throws a request-safe error
 * (statusCode set) rather than returning a boolean, so callers can just call
 * this inside a try block already wrapped by asyncHandler.
 */
const validateAssetSize = (file, kind = 'image') => {
  if (!file) return;
  const max = kind === 'video' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > max) {
    throw Object.assign(
      new Error(`${kind === 'video' ? 'Video' : 'Image'} exceeds max size of ${Math.round(max / (1024 * 1024))}MB`),
      { statusCode: 400 }
    );
  }
};

module.exports = {
  upload,
  validateAssetSize,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
};
