const mongoose = require('mongoose');

const standingSchema = new mongoose.Schema(
  {
    season: { type: String, required: true, default: '2024-25' },
    teamName: { type: String, required: true },
    teamCode: { type: String, required: true },
    logoUrl: { type: String, default: '' },
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
  { timestamps: true }
);

standingSchema.index({ season: 1, position: 1 });

module.exports = mongoose.model('Standing', standingSchema);
