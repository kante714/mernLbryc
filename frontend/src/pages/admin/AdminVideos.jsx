import { useState, useEffect } from 'react';
import { fetchVideos, createVideo, updateVideo, deleteVideo } from '../../api/videosApi';
import { Spinner, ErrorMessage, EmptyState, Badge } from '../../components/ui';
import { formatDate } from '../../utils/formatDate';
import MediaFileInput from '../../components/admin/MediaFileInput';

const CATEGORIES = ['highlights', 'interviews', 'training', 'academy-women'];

const EMPTY_FORM = { title: '', category: 'highlights', premium: true, description: '', duration: '' };

const AdminVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null); // null = create mode, object = edit mode
  const [form, setForm] = useState(EMPTY_FORM);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const load = () => {
    setLoading(true);
    fetchVideos({ limit: 100 })
      .then(({ data }) => { setVideos(data.videos); setError(null); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreateForm = () => {
    setEditingVideo(null);
    setForm(EMPTY_FORM);
    setThumbnailFile(null);
    setVideoFile(null);
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (video) => {
    setEditingVideo(video);
    setForm({
      title: video.title,
      category: video.category,
      premium: video.premium,
      description: video.description || '',
      duration: video.duration || '',
    });
    setThumbnailFile(null);
    setVideoFile(null);
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('category', form.category);
    formData.append('premium', form.premium);
    formData.append('description', form.description);
    if (form.duration) formData.append('duration', form.duration);
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
    if (videoFile) formData.append('video', videoFile);

    const onUploadProgress = (evt) => {
      if (evt.total) setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
    };

    try {
      if (editingVideo) {
        await updateVideo(editingVideo._id, formData, onUploadProgress);
      } else {
        await createVideo(formData, onUploadProgress);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save video.');
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This also removes the media from Cloudinary.`)) return;
    try {
      await deleteVideo(id);
      setVideos((prev) => prev.filter((v) => v._id !== id));
    } catch {
      alert('Failed to delete video.');
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div className="border-l-4 border-yellow-500 pl-6">
          <p className="text-yellow-400 text-xs uppercase tracking-[0.3em] mb-2">Admin</p>
          <h1 className="section-title">Video Manager</h1>
        </div>
        <button onClick={showForm ? closeForm : openCreateForm} className="btn-claret">
          {showForm ? 'Cancel' : '+ New Video'}
        </button>
      </div>

      {/* Create / edit form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-dark-700 border border-white/10 p-8 mb-10 space-y-5">
          <h2 className="font-display text-2xl text-white uppercase tracking-wider mb-6">
            {editingVideo ? 'Edit Video' : 'New Video'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
                Duration <span className="normal-case text-white/20">(auto-filled from video if left blank)</span>
              </label>
              <input placeholder="5:14" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
            </div>
            <div className="flex items-center gap-3 pt-7">
              <input type="checkbox" id="premium" checked={form.premium} onChange={(e) => setForm({ ...form, premium: e.target.checked })}
                className="accent-claret-800 w-4 h-4" />
              <label htmlFor="premium" className="text-white/60 text-sm uppercase tracking-widest">Libhura+ Exclusive</label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none resize-none" />
            </div>

            <MediaFileInput
              label="Thumbnail"
              kind="image"
              existingUrl={editingVideo?.thumbnail || ''}
              onChange={setThumbnailFile}
              required={!editingVideo}
            />
            <MediaFileInput
              label="Video File"
              kind="video"
              existingUrl={editingVideo?.videoUrl || ''}
              onChange={setVideoFile}
              required={!editingVideo}
            />
          </div>

          {saving && uploadProgress > 0 && (
            <div className="w-full bg-dark-800 h-1.5">
              <div className="bg-yellow-500 h-1.5 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}

          {formError && <p className="text-red-400 text-xs uppercase tracking-widest">{formError}</p>}

          <button type="submit" disabled={saving} className="btn-claret">
            {saving ? `Uploading... ${uploadProgress}%` : editingVideo ? 'Save Changes' : 'Publish Video'}
          </button>
        </form>
      )}

      {loading && <Spinner />}
      {error && <ErrorMessage />}
      {!loading && !error && videos.length === 0 && <EmptyState message="No videos yet." />}

      {!loading && !error && videos.length > 0 && (
        <div className="space-y-2">
          {videos.map((v) => (
            <div key={v._id} className="flex items-center gap-5 bg-dark-700 hover:bg-dark-600 px-5 py-4 transition-all border border-white/5">
              <div className="w-24 h-14 flex-shrink-0 overflow-hidden bg-dark-600">
                {v.thumbnail && <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm uppercase tracking-wide truncate">{v.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <Badge color="claret" className="text-[10px]">{v.category}</Badge>
                  <span className="text-white/30 text-xs">{formatDate(v.publishedAt)}</span>
                  <span className="text-white/30 text-xs font-mono">{v.duration}</span>
                  {v.premium && <Badge color="gold" className="text-[10px]">Libhura+</Badge>}
                  {!v.videoUrl && <Badge color="white" className="text-[10px]">No video file</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={() => openEditForm(v)}
                  className="text-xs text-white/30 hover:text-white uppercase tracking-widest transition-colors">Edit</button>
                <button onClick={() => handleDelete(v._id, v.title)}
                  className="text-xs text-red-500/60 hover:text-red-400 uppercase tracking-widest transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default AdminVideos;
