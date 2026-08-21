const asyncHandler = require('../utils/asyncHandler');
const newsService = require('../services/newsService');
const { validateAssetSize } = require('../middleware/uploadMiddleware');

const getArticles = asyncHandler(async (req, res) => {
  const result = await newsService.getArticles(req.query);
  res.json({ success: true, ...result });
});

const getFeatured = asyncHandler(async (req, res) => {
  const articles = await newsService.getFeaturedArticles(req.query.limit);
  res.json({ success: true, articles });
});

const getArticle = asyncHandler(async (req, res) => {
  const article = await newsService.getArticleBySlug(req.params.slug);
  res.json({ success: true, article });
});

const createArticle = asyncHandler(async (req, res) => {
  const imageFile = req.files?.image?.[0];
  validateAssetSize(imageFile, 'image');
  const article = await newsService.createArticle(req.body, imageFile);
  res.status(201).json({ success: true, article });
});

const updateArticle = asyncHandler(async (req, res) => {
  const imageFile = req.files?.image?.[0];
  validateAssetSize(imageFile, 'image');
  const article = await newsService.updateArticle(req.params.id, req.body, imageFile);
  res.json({ success: true, article });
});

const deleteArticle = asyncHandler(async (req, res) => {
  await newsService.deleteArticle(req.params.id);
  res.json({ success: true, message: 'Article deleted' });
});

module.exports = { getArticles, getFeatured, getArticle, createArticle, updateArticle, deleteArticle };
