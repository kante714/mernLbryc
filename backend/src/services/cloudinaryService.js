const cloudinary = require('../config/cloudinary');

/**
 * Streams a buffer (from multer memoryStorage) to Cloudinary.
 * Wrapped in a Promise because upload_stream is callback-based.
 */
const streamUpload = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });

const mapCloudinaryResult = (result, requestedFolder) => ({
  secureUrl: result.secure_url,
  publicId: result.public_id,
  assetId: result.asset_id,
  resourceType: result.resource_type,
  format: result.format,
  width: result.width || null,
  height: result.height || null,
  duration: result.duration || null,
  bytes: result.bytes || null,
  originalFilename: result.original_filename || '',
  folder: result.folder || requestedFolder || '',
  uploadedAt: result.created_at ? new Date(result.created_at) : new Date(),
});

/**
 * Uploads a single multer file (req.file or one entry from req.files) to
 * Cloudinary and returns a plain object matching mediaAssetSchema's shape.
 *
 * @param {object} file - multer file object (must have .buffer)
 * @param {object} options
 * @param {string} [options.folder] - Cloudinary folder, e.g. 'lbryc/videos'. Ignored if publicId is set.
 * @param {'image'|'video'|'auto'} options.resourceType
 * @param {string} [options.publicId] - deterministic public_id (e.g. 'lbryc/teams/bigu-fc').
 *   When set, the upload overwrites whatever asset already exists at that
 *   exact path instead of creating a new randomly-named one. Use this for
 *   assets that are logically "one per name" and get re-uploaded from
 *   multiple places over time (e.g. a team badge referenced by many
 *   matches) — it prevents the same badge accumulating dozens of duplicate
 *   copies in Cloudinary. Do NOT use it for assets that are genuinely
 *   unique per-document (thumbnails, photos, etc.) — those should get a
 *   fresh random public_id via `folder` instead.
 */
const uploadAsset = async (file, { folder, resourceType = 'auto', publicId } = {}) => {
  if (!file) return null;

  const options = { resource_type: resourceType };
  if (publicId) {
    options.public_id = publicId;
    options.overwrite = true;
    options.unique_filename = false;
    options.invalidate = true; // bust any CDN-cached copy at the old URL
  } else {
    options.folder = folder;
    options.unique_filename = true;
    options.overwrite = false;
  }

  const result = await streamUpload(file.buffer, options);
  return mapCloudinaryResult(result, folder);
};

/**
 * Deletes a previously-uploaded asset from Cloudinary by public_id.
 * Safe to call with an empty/undefined publicId (no-op) so callers don't
 * need to guard every call site — e.g. "delete old asset if one exists".
 */
const deleteAsset = async (publicId, resourceType = 'image') => {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

module.exports = { uploadAsset, deleteAsset };
