const express = require('express');
const router = express.Router();
const { getArticles, getFeatured, getArticle, createArticle, updateArticle, deleteArticle } = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Accepts an optional image file alongside the article's text fields
const articleUpload = upload.fields([{ name: 'image', maxCount: 1 }]);

router.get('/', getArticles);
router.get('/featured', getFeatured);
router.get('/:slug', getArticle);
router.post('/', protect, adminOnly, articleUpload, createArticle);
router.put('/:id', protect, adminOnly, articleUpload, updateArticle);
router.delete('/:id', protect, adminOnly, deleteArticle);

module.exports = router;
