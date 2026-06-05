const Match = require('../models/Match');

const getMatches = async ({ team, status, limit }) => {
  const query = {};
  if (team) query.team = team;
  if (status) query.status = status;

  return Match.find(query)
    .sort({ date: status === 'result' ? -1 : 1 })
    .limit(limit ? Number(limit) : 0);
};

const getNextMatch = async (team = 'men') =>
  Match.findOne({ team, status: 'upcoming' }).sort({ date: 1 });

const getMatchById = async (id) => {
  const match = await Match.findById(id);
  if (!match) throw Object.assign(new Error('Match not found'), { statusCode: 404 });
  return match;
};

const createMatch = async (data) => Match.create(data);

const updateMatch = async (id, data) => {
  const match = await Match.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!match) throw Object.assign(new Error('Match not found'), { statusCode: 404 });
  return match;
};

const deleteMatch = async (id) => {
  const match = await Match.findByIdAndDelete(id);
  if (!match) throw Object.assign(new Error('Match not found'), { statusCode: 404 });
  return match;
};

module.exports = { getMatches, getNextMatch, getMatchById, createMatch, updateMatch, deleteMatch };
