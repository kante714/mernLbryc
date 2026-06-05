const mongoose = require('mongoose');

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
    imageUrl: { type: String, default: '' },
    readTime: { type: Number, default: 2 },
    author: { type: String, default: 'Burnley FC' },
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
