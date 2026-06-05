const asyncHandler = require('../utils/asyncHandler');
const Video = require('../models/Video');

const getVideos = asyncHandler(async (req, res) => {
  const { category, premium } = req.query;
  const query = {};
  if (category) query.category = category;
  if (premium !== undefined) query.premium = premium === 'true';
  const videos = await Video.find(query).sort({ publishedAt: -1 });
  res.json({ success: true, videos });
});

const getVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) { res.status(404); throw new Error('Video not found'); }
  res.json({ success: true, video });
});

const createVideo = asyncHandler(async (req, res) => {
  const video = await Video.create(req.body);
  res.status(201).json({ success: true, video });
});

const deleteVideo = asyncHandler(async (req, res) => {
  await Video.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Video deleted' });
});

module.exports = { getVideos, getVideo, createVideo, deleteVideo };
