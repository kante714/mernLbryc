const asyncHandler = require('../utils/asyncHandler');
const matchService = require('../services/matchService');
const { validateAssetSize } = require('../middleware/uploadMiddleware');

const getMatches = asyncHandler(async (req, res) => {
  const matches = await matchService.getMatches(req.query);
  res.json({ success: true, matches });
});

const getNextMatch = asyncHandler(async (req, res) => {
  const match = await matchService.getNextMatch(req.query.team);
  res.json({ success: true, match });
});

const getMatch = asyncHandler(async (req, res) => {
  const match = await matchService.getMatchById(req.params.id);
  res.json({ success: true, match });
});

const validateMatchLogos = (files = {}) => {
  validateAssetSize(files.homeTeamLogo?.[0], 'image');
  validateAssetSize(files.awayTeamLogo?.[0], 'image');
  validateAssetSize(files.competitionLogo?.[0], 'image');
};

const createMatch = asyncHandler(async (req, res) => {
  validateMatchLogos(req.files);
  const match = await matchService.createMatch(req.body, req.files);
  res.status(201).json({ success: true, match });
});

const updateMatch = asyncHandler(async (req, res) => {
  validateMatchLogos(req.files);
  const match = await matchService.updateMatch(req.params.id, req.body, req.files);
  res.json({ success: true, match });
});

const deleteMatch = asyncHandler(async (req, res) => {
  await matchService.deleteMatch(req.params.id);
  res.json({ success: true, message: 'Match deleted' });
});

module.exports = { getMatches, getNextMatch, getMatch, createMatch, updateMatch, deleteMatch };
