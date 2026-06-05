const Article = require('../models/Article');

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

const createArticle = async (data) => Article.create(data);

const updateArticle = async (id, data) => {
  const article = await Article.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!article) throw Object.assign(new Error('Article not found'), { statusCode: 404 });
  return article;
};

const deleteArticle = async (id) => {
  const article = await Article.findByIdAndDelete(id);
  if (!article) throw Object.assign(new Error('Article not found'), { statusCode: 404 });
  return article;
};

const getFeaturedArticles = async (limit = 5) =>
  Article.find({ featured: true }).sort({ publishedAt: -1 }).limit(limit);

module.exports = { getArticles, getArticleBySlug, createArticle, updateArticle, deleteArticle, getFeaturedArticles };
