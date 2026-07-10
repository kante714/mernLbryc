const asyncHandler = require('../utils/asyncHandler');
const videoService = require('../services/videoService');
const { validateAssetSize } = require('../middleware/uploadMiddleware');

const getVideos = asyncHandler(async (req, res) => {
  const result = await videoService.getVideos(req.query);
  res.json({ success: true, ...result });
});

const getVideo = asyncHandler(async (req, res) => {
  const video = await videoService.getVideoById(req.params.id);
  res.json({ success: true, video });
});

const createVideo = asyncHandler(async (req, res) => {
  validateAssetSize(req.files?.thumbnail?.[0], 'image');
  validateAssetSize(req.files?.video?.[0], 'video');
  const video = await videoService.createVideo(req.body, req.files);
  res.status(201).json({ success: true, video });
});

const updateVideo = asyncHandler(async (req, res) => {
  validateAssetSize(req.files?.thumbnail?.[0], 'image');
  validateAssetSize(req.files?.video?.[0], 'video');
  const video = await videoService.updateVideo(req.params.id, req.body, req.files);
  res.json({ success: true, video });
});

const deleteVideo = asyncHandler(async (req, res) => {
  await videoService.deleteVideo(req.params.id);
  res.json({ success: true, message: 'Video deleted' });
});

module.exports = { getVideos, getVideo, createVideo, updateVideo, deleteVideo };
