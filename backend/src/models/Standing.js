const mongoose = require('mongoose');
const mediaAssetSchema = require('../utils/mediaAssetSchema');

const standingSchema = new mongoose.Schema(
  {
    season: { type: String, required: true, default: '2024-25' },
    teamName: { type: String, required: true },
    teamCode: { type: String, required: true },
    // Full Cloudinary metadata (needed to delete the asset later).
    logoAsset: { type: mediaAssetSchema, default: () => ({}) },
    position: { type: Number, required: true },
    played: { type: Number, default: 0 },
    won: { type: Number, default: 0 },
    drawn: { type: Number, default: 0 },
    lost: { type: Number, default: 0 },
    goalsFor: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 },
    goalDifference: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    form: { type: String, default: '' }, // e.g. "WDLLW"
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Backward-compatible virtual: any existing/external consumer reading
// standing.logoUrl as a plain string URL keeps working, while the real
// Cloudinary metadata lives in logoAsset above.
standingSchema.virtual('logoUrl').get(function () {
  return this.logoAsset?.secureUrl || '';
});

// Existing lookup index: fetch a season's table already sorted by rank
standingSchema.index({ season: 1, position: 1 });

// New: prevent the same team appearing twice in the same season's table
standingSchema.index({ season: 1, teamName: 1 }, { unique: true });

module.exports = mongoose.model('Standing', standingSchema);
