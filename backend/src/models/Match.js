const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    homeTeamLogo: { type: String, default: '' },
    awayTeamLogo: { type: String, default: '' },
    homeScore: { type: Number, default: null },
    awayScore: { type: Number, default: null },
    date: { type: Date, required: true, index: true },
    venue: { type: String, default: '' },
    competition: { type: String, default: 'Championship' },
    competitionLogo: { type: String, default: '' },
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
  { timestamps: true }
);

module.exports = mongoose.model('Match', matchSchema);
