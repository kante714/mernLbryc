const express = require('express');
const router = express.Router();
const { getVideos, getVideo, createVideo, updateVideo, deleteVideo } = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly, subscriberOrAdmin } = require('../middleware/adminMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Accepts an optional thumbnail image + an optional video file in one request
const videoUpload = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

router.get('/', getVideos);
router.get('/:id', protect, subscriberOrAdmin, getVideo);
router.post('/', protect, adminOnly, videoUpload, createVideo);
router.put('/:id', protect, adminOnly, videoUpload, updateVideo);
router.delete('/:id', protect, adminOnly, deleteVideo);

module.exports = router;
