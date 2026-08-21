import api from './axios';

export const fetchArticles = (params) => api.get('/news', { params });
export const fetchFeatured = (limit = 5) => api.get('/news/featured', { params: { limit } });
export const fetchArticle = (slug) => api.get(`/news/${slug}`);

// These send FormData (title/category/etc. as fields, plus an optional
// image file). Content-Type must be overridden per-request since the
// shared axios instance defaults to application/json — the browser fills
// in the multipart boundary itself.
export const createArticle = (formData, onUploadProgress) =>
  api.post('/news', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

export const updateArticle = (id, formData, onUploadProgress) =>
  api.put(`/news/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

export const deleteArticle = (id) => api.delete(`/news/${id}`);
