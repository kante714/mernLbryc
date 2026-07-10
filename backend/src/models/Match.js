const mongoose = require('mongoose');
const mediaAssetSchema = require('../utils/mediaAssetSchema');

const matchSchema = new mongoose.Schema(
  {
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    // Full Cloudinary metadata. Note: unlike other models, these are NOT
    // deleted when a Match is deleted — see matchService.js for why.
    homeTeamLogoAsset: { type: mediaAssetSchema, default: () => ({}) },
    awayTeamLogoAsset: { type: mediaAssetSchema, default: () => ({}) },
    homeScore: { type: Number, default: null },
    awayScore: { type: Number, default: null },
    date: { type: Date, required: true, index: true },
    venue: { type: String, default: '' },
    competition: { type: String, default: 'Championship' },
    competitionLogoAsset: { type: mediaAssetSchema, default: () => ({}) },
    broadcastInfo: { type: String, default: '' },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'result'],
      default: 'upcoming',
    },
    team: {
      type: String,
      enum: ['men', 'women', 'under-21', 'under-18'],
      default: 'men',
      index: true,
    },
    matchReportSlug: { type: String, default: '' },
    ticketUrl: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Backward-compatible virtuals: consumers reading these as plain string URLs
// keep working, while the real Cloudinary metadata lives in the *Asset fields.
matchSchema.virtual('homeTeamLogo').get(function () {
  return this.homeTeamLogoAsset?.secureUrl || '';
});
matchSchema.virtual('awayTeamLogo').get(function () {
  return this.awayTeamLogoAsset?.secureUrl || '';
});
matchSchema.virtual('competitionLogo').get(function () {
  return this.competitionLogoAsset?.secureUrl || '';
});

module.exports = mongoose.model('Match', matchSchema);
