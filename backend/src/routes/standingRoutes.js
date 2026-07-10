const express = require('express');
const router = express.Router();
const { getStandings, createStanding, updateStanding, deleteStanding } = require('../controllers/standingController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', getStandings);
router.post('/', protect, adminOnly, upload.single('logo'), createStanding);
router.put('/:id', protect, adminOnly, upload.single('logo'), updateStanding);
router.delete('/:id', protect, adminOnly, deleteStanding);

module.exports = router;
