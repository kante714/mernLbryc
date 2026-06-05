const express = require('express');
const router = express.Router();
const { getStandings, updateStanding } = require('../controllers/standingController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getStandings);
router.put('/:id', protect, adminOnly, updateStanding);

module.exports = router;
