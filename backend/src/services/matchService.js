const slugify = require('slugify');
const Match = require('../models/Match');
const { uploadAsset } = require('./cloudinaryService');

const TEAM_LOGO_FOLDER = 'lbryc/teams';
const COMPETITION_LOGO_FOLDER = 'lbryc/competitions';

const teamLogoPublicId = (name) => `${TEAM_LOGO_FOLDER}/${slugify(name, { lower: true, strict: true })}`;
const competitionLogoPublicId = (name) => `${COMPETITION_LOGO_FOLDER}/${slugify(name, { lower: true, strict: true })}`;

const getMatches = async ({ team, status, limit }) => {
  const query = {};
  if (team) query.team = team;
  if (status) query.status = status;

  return Match.find(query)
    .sort({ date: status === 'result' ? -1 : 1 })
    .limit(limit ? Number(limit) : 0);
};

const getNextMatch = async (team = 'men') =>
  Match.findOne({ team, status: 'upcoming' }).sort({ date: 1 });

const getMatchById = async (id) => {
  const match = await Match.findById(id);
  if (!match) throw Object.assign(new Error('Match not found'), { statusCode: 404 });
  return match;
};

/**
 * Team/competition badges use a *deterministic* Cloudinary public_id derived
 * from the team/competition name, rather than a random one per upload —
 * because the same handful of badges get reused across dozens of fixtures.
 * Re-uploading "Bigu"'s badge from any match's form overwrites the same
 * Cloudinary asset in place instead of cloning a new copy every time.
 *
 * Consequence: deleteMatch() below must NOT delete these assets — other
 * matches referencing the same team/competition may still depend on them.
 */
const attachLogoUploads = async (payload, files = {}) => {
  const homeFile = files.homeTeamLogo?.[0];
  const awayFile = files.awayTeamLogo?.[0];
  const competitionFile = files.competitionLogo?.[0];

  if (homeFile && !payload.homeTeam) {
    throw Object.assign(new Error('homeTeam is required when uploading a home team logo'), { statusCode: 400 });
  }
  if (awayFile && !payload.awayTeam) {
    throw Object.assign(new Error('awayTeam is required when uploading an away team logo'), { statusCode: 400 });
  }
  if (competitionFile && !payload.competition) {
    throw Object.assign(new Error('competition is required when uploading a competition logo'), { statusCode: 400 });
  }

  const [homeAsset, awayAsset, competitionAsset] = await Promise.all([
    homeFile ? uploadAsset(homeFile, { resourceType: 'image', publicId: teamLogoPublicId(payload.homeTeam) }) : null,
    awayFile ? uploadAsset(awayFile, { resourceType: 'image', publicId: teamLogoPublicId(payload.awayTeam) }) : null,
    competitionFile ? uploadAsset(competitionFile, { resourceType: 'image', publicId: competitionLogoPublicId(payload.competition) }) : null,
  ]);

  if (homeAsset) payload.homeTeamLogoAsset = homeAsset;
  if (awayAsset) payload.awayTeamLogoAsset = awayAsset;
  if (competitionAsset) payload.competitionLogoAsset = competitionAsset;
  return payload;
};

const createMatch = async (data, files) => {
  const payload = await attachLogoUploads({ ...data }, files);
  return Match.create(payload);
};

const updateMatch = async (id, data, files) => {
  const payload = await attachLogoUploads({ ...data }, files);
  const match = await Match.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!match) throw Object.assign(new Error('Match not found'), { statusCode: 404 });
  return match;
};

// No Cloudinary cleanup here, deliberately — see attachLogoUploads() above.
// Team/competition badges are shared across matches, so deleting one
// fixture must never delete a badge other fixtures still rely on.
const deleteMatch = async (id) => {
  const match = await Match.findByIdAndDelete(id);
  if (!match) throw Object.assign(new Error('Match not found'), { statusCode: 404 });
  return match;
};

module.exports = { getMatches, getNextMatch, getMatchById, createMatch, updateMatch, deleteMatch };
