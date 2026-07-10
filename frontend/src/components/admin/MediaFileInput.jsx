import { useState, useEffect, useRef } from 'react';

// Mirrors the backend's MAX_IMAGE_BYTES / MAX_VIDEO_BYTES in uploadMiddleware.js —
// keep these two in sync if that ever changes.
const MAX_SIZE_MB = { image: 8, video: 100 };
const ACCEPT = {
  image: 'image/jpeg,image/png,image/webp,image/gif',
  video: 'video/mp4,video/webm,video/quicktime',
};

/**
 * File picker with preview for a single image or video.
 *
 * @param {string} label
 * @param {'image'|'video'} kind
 * @param {string} existingUrl - current Cloudinary URL when editing an existing record
 * @param {(file: File|null) => void} onChange - fires with the selected File, or null if cleared/rejected
 * @param {boolean} required - only affects the visual "*" marker; validation stays the caller's job
 */
const MediaFileInput = ({ label, kind = 'image', existingUrl = '', onChange, required = false }) => {
  const [preview, setPreview] = useState(existingUrl || '');
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const objectUrlRef = useRef(null);

  // If the parent swaps which record is being edited, reset to that record's asset
  useEffect(() => {
    setPreview(existingUrl || '');
  }, [existingUrl]);

  // Release any blob: URL we created, on unmount
  useEffect(() => () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
  }, []);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    setError('');

    if (!file) {
      onChange(null);
      setPreview(existingUrl || '');
      return;
    }

    const maxBytes = MAX_SIZE_MB[kind] * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`File exceeds ${MAX_SIZE_MB[kind]}MB limit`);
      onChange(null);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;

    onChange(file);
    setPreview(url);
  };

  return (
    <div>
      <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
        {label} {required && '*'}
      </label>

      {preview && (
        <div className="mb-3 w-full max-w-xs aspect-video bg-dark-800 overflow-hidden border border-white/10">
          {kind === 'video'
            ? <video src={preview} controls className="w-full h-full object-cover" />
            : <img src={preview} alt="" className="w-full h-full object-cover" />}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT[kind]}
        onChange={handleFile}
        className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white/70 text-xs
                   file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-claret-800 file:text-white
                   file:text-xs file:uppercase file:tracking-widest file:cursor-pointer px-1 py-1 outline-none"
      />
      <p className="text-white/20 text-[10px] mt-1 uppercase tracking-widest">Max {MAX_SIZE_MB[kind]}MB</p>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default MediaFileInput;
