const asyncHandler = require('../utils/asyncHandler');
const Standing = require('../models/Standing');

const getStandings = asyncHandler(async (req, res) => {
  const { season = '2024-25' } = req.query;
  const standings = await Standing.find({ season }).sort({ position: 1 });
  res.json({ success: true, standings });
});

const updateStanding = asyncHandler(async (req, res) => {
  const standing = await Standing.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!standing) { res.status(404); throw new Error('Standing not found'); }
  res.json({ success: true, standing });
});

module.exports = { getStandings, updateStanding };
