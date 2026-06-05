const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'] },
    category: {
      type: String,
      required: true,
      enum: ['highlights', 'interviews', 'training', 'academy-women'],
    },
    thumbnail: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    duration: { type: String, default: '0:00' },
    premium: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now, index: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);
