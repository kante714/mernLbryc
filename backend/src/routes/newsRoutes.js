const express = require('express');
const router = express.Router();
const { getArticles, getFeatured, getArticle, createArticle, updateArticle, deleteArticle } = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getArticles);
router.get('/featured', getFeatured);
router.get('/:slug', getArticle);
router.post('/', protect, adminOnly, createArticle);
router.put('/:id', protect, adminOnly, updateArticle);
router.delete('/:id', protect, adminOnly, deleteArticle);

module.exports = router;
