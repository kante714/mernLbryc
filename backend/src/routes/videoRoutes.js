const express = require('express');
const router = express.Router();
const { getVideos, getVideo, createVideo, deleteVideo } = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly, subscriberOrAdmin } = require('../middleware/adminMiddleware');

router.get('/', getVideos);
router.get('/:id', protect, subscriberOrAdmin, getVideo);
router.post('/', protect, adminOnly, createVideo);
router.delete('/:id', protect, adminOnly, deleteVideo);

module.exports = router;
