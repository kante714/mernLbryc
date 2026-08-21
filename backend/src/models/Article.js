const mongoose = require('mongoose');
const mediaAssetSchema = require('../utils/mediaAssetSchema');

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'] },
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ['club-news', 'match-previews', 'match-reports', 'ticket-news',
             'training', 'community', 'commercial', 'boardroom'],
    },
    summary: { type: String },
    body: { type: String },
    // Plain URL string — kept for backward compatibility with articles that
    // were created by pasting an external image URL, and it's what the
    // frontend has always read directly. When an image is uploaded as a
    // file instead, this gets set to the resulting Cloudinary secure_url.
    imageUrl: { type: String, default: '' },
    // Full Cloudinary metadata for uploaded images (empty for articles that
    // just have an external imageUrl). Needed so the old asset can be
    // deleted from Cloudinary when the image is replaced or the article is
    // deleted — a bare URL string alone doesn't give us a public_id.
    imageAsset: { type: mediaAssetSchema, default: () => ({}) },
    readTime: { type: Number, default: 2 },
    author: { type: String, default: 'LBRYC' },
    team: {
      type: String,
      enum: ['men', 'women', 'under-21', 'under-18', 'general'],
      default: 'general',
    },
    publishedAt: { type: Date, default: Date.now, index: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Text index for search
articleSchema.index({ title: 'text', summary: 'text' });

module.exports = mongoose.model('Article', articleSchema);
