import api from './axios';

export const fetchStandings = (params) => api.get('/standings', { params });

// These send FormData (teamName/position/etc. as fields, plus an optional
// logo file). Content-Type is overridden per-request — the shared axios
// instance defaults to application/json, but the browser needs to set the
// multipart boundary itself.
export const createStanding = (formData, onUploadProgress) =>
  api.post('/standings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

export const updateStanding = (id, formData, onUploadProgress) =>
  api.put(`/standings/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

export const deleteStanding = (id) => api.delete(`/standings/${id}`);
