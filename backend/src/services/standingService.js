const Standing = require('../models/Standing');
const { uploadAsset, deleteAsset } = require('./cloudinaryService');

const LOGO_FOLDER = 'lbryc/standings';

const getStandings = async ({ season = '2024-25' }) => {
  return Standing.find({ season }).sort({ position: 1 });
};

const getStandingById = async (id) => {
  const standing = await Standing.findById(id);
  if (!standing) throw Object.assign(new Error('Standing not found'), { statusCode: 404 });
  return standing;
};

const createStanding = async (data, file) => {
  const payload = { ...data };
  if (file) {
    payload.logoAsset = await uploadAsset(file, { folder: LOGO_FOLDER, resourceType: 'image' });
  }
  return Standing.create(payload);
};

const updateStanding = async (id, data, file) => {
  // Fetch first (rather than findByIdAndUpdate) so we have the previous
  // logoAsset.publicId available to delete before uploading the replacement.
  const standing = await getStandingById(id);
  const updates = { ...data };

  if (file) {
    await deleteAsset(standing.logoAsset?.publicId, standing.logoAsset?.resourceType || 'image');
    updates.logoAsset = await uploadAsset(file, { folder: LOGO_FOLDER, resourceType: 'image' });
  }

  Object.assign(standing, updates);
  await standing.save();
  return standing;
};

const deleteStanding = async (id) => {
  const standing = await getStandingById(id);
  await deleteAsset(standing.logoAsset?.publicId, standing.logoAsset?.resourceType || 'image');
  await standing.deleteOne();
  return standing;
};

module.exports = { getStandings, getStandingById, createStanding, updateStanding, deleteStanding };
