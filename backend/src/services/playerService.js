const Player = require('../models/Player');
const { uploadAsset, deleteAsset } = require('./cloudinaryService');

const PHOTO_FOLDER = 'lbryc/players';

// `stats` is a nested object in the schema, but multipart/form-data (used
// for photo uploads) can only carry flat string fields. The frontend sends
// it as a JSON string in that case; plain JSON requests already send it as
// a real object, so only normalize when it actually arrived as a string.
const normalizePayload = (data) => {
  const payload = { ...data };
  if (typeof payload.stats === 'string') {
    try {
      payload.stats = JSON.parse(payload.stats);
    } catch {
      throw Object.assign(new Error('Invalid stats format'), { statusCode: 400 });
    }
  }
  return payload;
};

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

const getPlayerById = async (id) => {
  const player = await Player.findById(id);
  if (!player) throw Object.assign(new Error('Player not found'), { statusCode: 404 });
  return player;
};

const createPlayer = async (data, file) => {
  const payload = normalizePayload(data);
  if (file) {
    payload.photoAsset = await uploadAsset(file, { folder: PHOTO_FOLDER, resourceType: 'image' });
  }
  return Player.create(payload);
};

const updatePlayer = async (id, data, file) => {
  // Fetching first (rather than findByIdAndUpdate directly) is required here:
  // we need the *previous* photoAsset.publicId to delete it from Cloudinary
  // before the new one is uploaded.
  const player = await getPlayerById(id);
  const updates = normalizePayload(data);

  if (file) {
    await deleteAsset(player.photoAsset?.publicId, player.photoAsset?.resourceType || 'image');
    updates.photoAsset = await uploadAsset(file, { folder: PHOTO_FOLDER, resourceType: 'image' });
  }

  Object.assign(player, updates);
  await player.save(); // still runs schema validators, same as the old findByIdAndUpdate(..., { runValidators: true })
  return player;
};

const deletePlayer = async (id) => {
  const player = await getPlayerById(id);
  await deleteAsset(player.photoAsset?.publicId, player.photoAsset?.resourceType || 'image');
  await player.deleteOne();
  return player;
};

module.exports = { getPlayers, getPlayerBySlug, getPlayerById, createPlayer, updatePlayer, deletePlayer };
