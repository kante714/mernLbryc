import api from './axios';

export const fetchPlayers = (params) => api.get('/players', { params });
export const fetchPlayer  = (slug)   => api.get(`/players/${slug}`);
export const createPlayer = (data)   => api.post('/players', data);
export const updatePlayer = (id, data) => api.put(`/players/${id}`, data);
export const deletePlayer = (id)     => api.delete(`/players/${id}`);
