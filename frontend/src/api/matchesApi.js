import api from './axios';

export const fetchMatches = (params) => api.get('/matches', { params });
export const fetchNextMatch = (team = 'men') => api.get('/matches/next', { params: { team } });
export const fetchMatch = (id) => api.get(`/matches/${id}`);

// These send FormData (homeTeam/date/etc. as fields, plus optional logo files).
// Content-Type is overridden per-request — the shared axios instance defaults
// to application/json, but the browser needs to set the multipart boundary itself.
export const createMatch = (formData, onUploadProgress) =>
  api.post('/matches', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

export const updateMatch = (id, formData, onUploadProgress) =>
  api.put(`/matches/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

export const deleteMatch = (id) => api.delete(`/matches/${id}`);
