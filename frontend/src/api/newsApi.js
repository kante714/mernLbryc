import api from './axios';

export const fetchArticles = (params) => api.get('/news', { params });
export const fetchFeatured = (limit = 5) => api.get('/news/featured', { params: { limit } });
export const fetchArticle = (slug) => api.get(`/news/${slug}`);
export const createArticle = (data) => api.post('/news', data);
export const updateArticle = (id, data) => api.put(`/news/${id}`, data);
export const deleteArticle = (id) => api.delete(`/news/${id}`);
