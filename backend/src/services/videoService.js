const Video = require('../models/Video');
const { uploadAsset, deleteAsset } = require('./cloudinaryService');

const THUMBNAIL_FOLDER = 'lbryc/videos/thumbnails';
const VIDEO_FOLDER = 'lbryc/videos/originals';

// Cloudinary reports video duration in seconds (number). The UI displays a
// "5:14" style string. Auto-derive it on upload unless the admin typed one in.
const formatDuration = (totalSeconds) => {
  if (totalSeconds === null || totalSeconds === undefined) return null;
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.round(totalSeconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

const getVideos = async ({ category, premium, page = 1, limit = 20 }) => {
  const query = {};
  if (category) query.category = category;
  if (premium !== undefined) query.premium = premium === 'true' || premium === true;

  const skip = (page - 1) * limit;
  const [videos, total] = await Promise.all([
    Video.find(query).sort({ publishedAt: -1 }).skip(skip).limit(Number(limit)),
    Video.countDocuments(query),
  ]);

  return { videos, total, page: Number(page), pages: Math.ceil(total / limit) };
};

const getVideoById = async (id) => {
  const video = await Video.findById(id);
  if (!video) throw Object.assign(new Error('Video not found'), { statusCode: 404 });
  return video;
};

/**
 * @param {object} data - non-file form fields (title, category, description, etc.)
 * @param {object} files - req.files from multer .fields([{name:'thumbnail'},{name:'video'}])
 */
const createVideo = async (data, files = {}) => {
  const thumbnailFile = files.thumbnail?.[0];
  const videoFile = files.video?.[0];

  const [thumbnailAsset, videoAsset] = await Promise.all([
    thumbnailFile ? uploadAsset(thumbnailFile, { folder: THUMBNAIL_FOLDER, resourceType: 'image' }) : null,
    videoFile ? uploadAsset(videoFile, { folder: VIDEO_FOLDER, resourceType: 'video' }) : null,
  ]);

  const payload = { ...data };
  if (thumbnailAsset) payload.thumbnailAsset = thumbnailAsset;
  if (videoAsset) {
    payload.videoAsset = videoAsset;
    if (!payload.duration && videoAsset.duration) {
      payload.duration = formatDuration(videoAsset.duration);
    }
  }

  return Video.create(payload);
};

const updateVideo = async (id, data, files = {}) => {
  const video = await getVideoById(id);
  const thumbnailFile = files.thumbnail?.[0];
  const videoFile = files.video?.[0];

  const updates = { ...data };

  // Replace-on-update: delete the previous Cloudinary asset before uploading
  // the new one, so nothing orphaned is left behind.
  if (thumbnailFile) {
    await deleteAsset(video.thumbnailAsset?.publicId, video.thumbnailAsset?.resourceType || 'image');
    updates.thumbnailAsset = await uploadAsset(thumbnailFile, { folder: THUMBNAIL_FOLDER, resourceType: 'image' });
  }

  if (videoFile) {
    await deleteAsset(video.videoAsset?.publicId, video.videoAsset?.resourceType || 'video');
    updates.videoAsset = await uploadAsset(videoFile, { folder: VIDEO_FOLDER, resourceType: 'video' });
    if (!updates.duration && updates.videoAsset.duration) {
      updates.duration = formatDuration(updates.videoAsset.duration);
    }
  }

  Object.assign(video, updates);
  await video.save();
  return video;
};

const deleteVideo = async (id) => {
  const video = await getVideoById(id);
  await Promise.all([
    deleteAsset(video.thumbnailAsset?.publicId, video.thumbnailAsset?.resourceType || 'image'),
    deleteAsset(video.videoAsset?.publicId, video.videoAsset?.resourceType || 'video'),
  ]);
  await video.deleteOne();
  return video;
};

module.exports = { getVideos, getVideoById, createVideo, updateVideo, deleteVideo };
