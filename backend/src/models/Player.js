const mongoose = require('mongoose');
const mediaAssetSchema = require('../utils/mediaAssetSchema');

const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    slug: { type: String, required: true, unique: true, index: true },
    position: {
      type: String,
      required: true,
      enum: ['goalkeeper', 'defender', 'midfielder', 'forward', 'coaching-staff'],
    },
    squad: {
      type: String,
      enum: ['men', 'women', 'under-21', 'under-18', 'e-sports'],
      default: 'men',
    },
    shirtNumber: { type: Number, default: null },
    nationality: { type: String, default: '' },
    nationalityFlag: { type: String, default: '' },
    // Full Cloudinary metadata (needed to delete the asset later).
    photoAsset: { type: mediaAssetSchema, default: () => ({}) },
    onLoan: { type: Boolean, default: false },
    stats: {
      appearances: { type: Number, default: 0 },
      goals: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
      cleanSheets: { type: Number, default: 0 },
      yellowCards: { type: Number, default: 0 },
      redCards: { type: Number, default: 0 },
    },
    bio: { type: String, default: '' },
    dateOfBirth: { type: Date },
    height: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Backward-compatible virtual: existing frontend code reads player.photoUrl
// as a plain string URL. Keep serving that shape while the real Cloudinary
// metadata (public_id, etc.) lives in photoAsset above.
playerSchema.virtual('photoUrl').get(function () {
  return this.photoAsset?.secureUrl || '';
});

playerSchema.index({ squad: 1, position: 1 });

module.exports = mongoose.model('Player', playerSchema);
