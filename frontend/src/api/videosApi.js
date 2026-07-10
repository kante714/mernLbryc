import api from './axios';

export const fetchVideos = (params) => api.get('/videos', { params });
export const fetchVideo = (id) => api.get(`/videos/${id}`);

// These send FormData (title/category/etc. as fields, plus optional thumbnail/video files).
// Content-Type must be overridden per-request since the shared axios instance
// defaults to application/json — the browser fills in the multipart boundary itself.
export const createVideo = (formData, onUploadProgress) =>
  api.post('/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

export const updateVideo = (id, formData, onUploadProgress) =>
  api.put(`/videos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

export const deleteVideo = (id) => api.delete(`/videos/${id}`);
