const express = require('express');
const router = express.Router();
const { getPlayers, getPlayer, createPlayer, updatePlayer, deletePlayer } = require('../controllers/playerController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', getPlayers);
router.get('/:slug', getPlayer);
router.post('/', protect, adminOnly, upload.single('photo'), createPlayer);
router.put('/:id', protect, adminOnly, upload.single('photo'), updatePlayer);
router.delete('/:id', protect, adminOnly, deletePlayer);

module.exports = router;
