const asyncHandler = require('../utils/asyncHandler');
const playerService = require('../services/playerService');
const { validateAssetSize } = require('../middleware/uploadMiddleware');

const getPlayers = asyncHandler(async (req, res) => {
  const players = await playerService.getPlayers(req.query);
  res.json({ success: true, players });
});

const getPlayer = asyncHandler(async (req, res) => {
  const player = await playerService.getPlayerBySlug(req.params.slug);
  res.json({ success: true, player });
});

const createPlayer = asyncHandler(async (req, res) => {
  validateAssetSize(req.file, 'image');
  const player = await playerService.createPlayer(req.body, req.file);
  res.status(201).json({ success: true, player });
});

const updatePlayer = asyncHandler(async (req, res) => {
  validateAssetSize(req.file, 'image');
  const player = await playerService.updatePlayer(req.params.id, req.body, req.file);
  res.json({ success: true, player });
});

const deletePlayer = asyncHandler(async (req, res) => {
  await playerService.deletePlayer(req.params.id);
  res.json({ success: true, message: 'Player deleted' });
});

module.exports = { getPlayers, getPlayer, createPlayer, updatePlayer, deletePlayer };
