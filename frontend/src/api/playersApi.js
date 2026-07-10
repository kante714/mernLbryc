import api from './axios';

export const fetchPlayers = (params) => api.get('/players', { params });
export const fetchPlayer  = (slug)   => api.get(`/players/${slug}`);

// These send FormData (name/position/stats/etc. as fields, plus an optional
// photo file). Content-Type is overridden per-request — the shared axios
// instance defaults to application/json, but the browser needs to set the
// multipart boundary itself.
export const createPlayer = (formData, onUploadProgress) =>
  api.post('/players', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

export const updatePlayer = (id, formData, onUploadProgress) =>
  api.put(`/players/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

export const deletePlayer = (id) => api.delete(`/players/${id}`);
