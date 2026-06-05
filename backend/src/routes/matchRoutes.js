const express = require('express');
const router = express.Router();
const {
  getMatches, getNextMatch, getMatch,
  createMatch, updateMatch, deleteMatch
} = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// IMPORTANT: specific named routes MUST come before /:id param routes
router.get('/next', getNextMatch);          // GET /api/matches/next
router.get('/',     getMatches);            // GET /api/matches
router.get('/:id',  getMatch);              // GET /api/matches/:id

router.post('/',    protect, adminOnly, createMatch);
router.put('/:id',  protect, adminOnly, updateMatch);
router.delete('/:id', protect, adminOnly, deleteMatch);

module.exports = router;
