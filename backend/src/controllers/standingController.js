const asyncHandler = require('../utils/asyncHandler');
const standingService = require('../services/standingService');
const { validateAssetSize } = require('../middleware/uploadMiddleware');

const getStandings = asyncHandler(async (req, res) => {
  const standings = await standingService.getStandings(req.query);
  res.json({ success: true, standings });
});

const createStanding = asyncHandler(async (req, res) => {
  validateAssetSize(req.file, 'image');
  const standing = await standingService.createStanding(req.body, req.file);
  res.status(201).json({ success: true, standing });
});

const updateStanding = asyncHandler(async (req, res) => {
  validateAssetSize(req.file, 'image');
  const standing = await standingService.updateStanding(req.params.id, req.body, req.file);
  res.json({ success: true, standing });
});

const deleteStanding = asyncHandler(async (req, res) => {
  await standingService.deleteStanding(req.params.id);
  res.json({ success: true, message: 'Standing deleted' });
});

module.exports = { getStandings, createStanding, updateStanding, deleteStanding };
