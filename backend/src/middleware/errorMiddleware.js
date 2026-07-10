const multer = require('multer');

// Friendlier text for Multer's terse built-in error codes
const MULTER_ERROR_MESSAGES = {
  LIMIT_FILE_SIZE: 'Uploaded file is too large',
  LIMIT_UNEXPECTED_FILE: 'Unexpected file field in upload',
  LIMIT_FILE_COUNT: 'Too many files in upload',
  LIMIT_FIELD_COUNT: 'Too many fields in upload',
};

const errorHandler = (err, req, res, next) => {
  // Use statusCode set on the error object, or res.statusCode if already set, or 500
  let statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'Server Error';

  // Multer upload errors (file too large, wrong field name, etc.)
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    message = MULTER_ERROR_MESSAGES[err.code] || `Upload error: ${err.code}`;
  }

  // Cloudinary SDK errors — surface as 502 (upstream failure), not 500,
  // since the request itself was well-formed; Cloudinary just failed.
  if (err.http_code && !err.statusCode) {
    statusCode = 502;
    message = err.message || 'Cloudinary upload failed';
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
