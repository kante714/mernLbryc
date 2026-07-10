const mongoose = require('mongoose');

// Embeddable sub-schema for a single Cloudinary asset.
// Every model field that stores an uploaded image/video should use this
// instead of a bare String, so the asset can be deleted from Cloudinary
// later without having to parse a public_id back out of a URL.
//
// _id: false — these are always embedded (never queried/populated on their
// own), so there's no need for Mongo to generate an _id per sub-document.
const mediaAssetSchema = new mongoose.Schema(
  {
    secureUrl: { type: String, default: '' },
    publicId: { type: String, default: '' },
    assetId: { type: String, default: '' },
    resourceType: { type: String, enum: ['image', 'video', 'raw'], default: 'image' },
    format: { type: String, default: '' },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    duration: { type: Number, default: null }, // seconds — video only
    bytes: { type: Number, default: null },
    originalFilename: { type: String, default: '' },
    folder: { type: String, default: '' },
    uploadedAt: { type: Date, default: null }, // Cloudinary's created_at, not Mongo's
  },
  { _id: false }
);

module.exports = mediaAssetSchema;
