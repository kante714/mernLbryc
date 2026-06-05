import api from './axios';

export const fetchMatches = (params) => api.get('/matches', { params });
export const fetchNextMatch = (team = 'men') => api.get('/matches/next', { params: { team } });
export const fetchMatch = (id) => api.get(`/matches/${id}`);
export const createMatch = (data) => api.post('/matches', data);
export const updateMatch = (id, data) => api.put(`/matches/${id}`, data);
export const deleteMatch = (id) => api.delete(`/matches/${id}`);
