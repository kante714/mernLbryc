const Article = require('../models/Article');
const { uploadAsset, deleteAsset } = require('./cloudinaryService');

const ARTICLE_IMAGE_FOLDER = 'lbryc/news/images';

const getArticles = async ({ category, team, page = 1, limit = 12, search }) => {
  const query = {};
  if (category) query.category = category;
  if (team) query.team = team;
  if (search) query.$text = { $search: search };

  const skip = (page - 1) * limit;
  const [articles, total] = await Promise.all([
    Article.find(query).sort({ publishedAt: -1 }).skip(skip).limit(Number(limit)),
    Article.countDocuments(query),
  ]);

  return { articles, total, page: Number(page), pages: Math.ceil(total / limit) };
};

const getArticleBySlug = async (slug) => {
  const article = await Article.findOne({ slug });
  if (!article) throw Object.assign(new Error('Article not found'), { statusCode: 404 });
  return article;
};

/**
 * @param {object} data - non-file form fields (title, category, imageUrl, etc.)
 * @param {object} [imageFile] - req.files.image[0] from multer, if an image file was uploaded
 */
const createArticle = async (data, imageFile) => {
  const payload = { ...data };

  if (imageFile) {
    const imageAsset = await uploadAsset(imageFile, { folder: ARTICLE_IMAGE_FOLDER, resourceType: 'image' });
    payload.imageAsset = imageAsset;
    payload.imageUrl = imageAsset.secureUrl;
  }

  return Article.create(payload);
};

const updateArticle = async (id, data, imageFile) => {
  const article = await getArticleById(id);
  const updates = { ...data };

  // Replace-on-update: delete the previous Cloudinary asset (if there was
  // one) before uploading the new one, so nothing orphaned is left behind.
  if (imageFile) {
    await deleteAsset(article.imageAsset?.publicId, article.imageAsset?.resourceType || 'image');
    const imageAsset = await uploadAsset(imageFile, { folder: ARTICLE_IMAGE_FOLDER, resourceType: 'image' });
    updates.imageAsset = imageAsset;
    updates.imageUrl = imageAsset.secureUrl;
  }

  Object.assign(article, updates);
  await article.save();
  return article;
};

const getArticleById = async (id) => {
  const article = await Article.findById(id);
  if (!article) throw Object.assign(new Error('Article not found'), { statusCode: 404 });
  return article;
};

const deleteArticle = async (id) => {
  const article = await Article.findByIdAndDelete(id);
  if (!article) throw Object.assign(new Error('Article not found'), { statusCode: 404 });
  await deleteAsset(article.imageAsset?.publicId, article.imageAsset?.resourceType || 'image');
  return article;
};

const getFeaturedArticles = async (limit = 5) =>
  Article.find({ featured: true }).sort({ publishedAt: -1 }).limit(limit);

module.exports = { getArticles, getArticleBySlug, createArticle, updateArticle, deleteArticle, getFeaturedArticles };
