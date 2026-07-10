const mongoose = require('mongoose');
const mediaAssetSchema = require('../utils/mediaAssetSchema');

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'] },
    category: {
      type: String,
      required: true,
      enum: ['highlights', 'interviews', 'training', 'academy-women'],
    },
    // Full Cloudinary metadata lives here (needed to delete assets later).
    thumbnailAsset: { type: mediaAssetSchema, default: () => ({}) },
    videoAsset: { type: mediaAssetSchema, default: () => ({}) },
    duration: { type: String, default: '0:00' }, // display format e.g. "5:14"
    premium: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now, index: true },
    description: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Backward-compatible virtuals: existing frontend code reads video.thumbnail
// and video.videoUrl as plain string URLs. Keep serving that exact shape
// while the real Cloudinary metadata (public_id, etc.) lives in the *Asset
// fields above, where it's actually usable for deletion on update/delete.
videoSchema.virtual('thumbnail').get(function () {
  return this.thumbnailAsset?.secureUrl || '';
});

videoSchema.virtual('videoUrl').get(function () {
  return this.videoAsset?.secureUrl || '';
});

// Most common query pattern: filter the library by category, optionally by tier
videoSchema.index({ category: 1, premium: 1 });

module.exports = mongoose.model('Video', videoSchema);
