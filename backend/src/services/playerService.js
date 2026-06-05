const Player = require('../models/Player');

const getPlayers = async ({ squad, position, onLoan }) => {
  const query = {};
  if (squad) query.squad = squad;
  if (position) query.position = position;
  if (onLoan !== undefined) query.onLoan = onLoan === 'true';
  return Player.find(query).sort({ shirtNumber: 1 });
};

const getPlayerBySlug = async (slug) => {
  const player = await Player.findOne({ slug });
  if (!player) throw Object.assign(new Error('Player not found'), { statusCode: 404 });
  return player;
};

const createPlayer = async (data) => Player.create(data);

const updatePlayer = async (id, data) => {
  const player = await Player.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!player) throw Object.assign(new Error('Player not found'), { statusCode: 404 });
  return player;
};

const deletePlayer = async (id) => {
  const player = await Player.findByIdAndDelete(id);
  if (!player) throw Object.assign(new Error('Player not found'), { statusCode: 404 });
  return player;
};

module.exports = { getPlayers, getPlayerBySlug, createPlayer, updatePlayer, deletePlayer };
