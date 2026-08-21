import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchArticles, deleteArticle, createArticle } from '../../api/newsApi';
import { Spinner, ErrorMessage, Badge } from '../../components/ui';
import { formatDate } from '../../utils/formatDate';
import MediaFileInput from '../../components/admin/MediaFileInput';

const CATEGORIES = ['club-news','match-previews','match-reports','ticket-news','training','community','commercial','boardroom'];
const TEAMS = ['men','women','under-21','under-18','general'];

const EMPTY_FORM = { title: '', slug: '', category: 'club-news', summary: '', body: '', readTime: 2, team: 'general', featured: false };

const slugify = (str) => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

const AdminNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const load = () => {
    setLoading(true);
    fetchArticles({ limit: 50 })
      .then(({ data }) => { setArticles(data.articles); setError(null); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleTitleChange = (title) => setForm((f) => ({ ...f, title, slug: slugify(title) }));

  const openCreateForm = () => {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    setUploadProgress(0);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (imageFile) formData.append('image', imageFile);

    const onUploadProgress = (evt) => {
      if (evt.total) setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
    };

    try {
      await createArticle(formData, onUploadProgress);
      setShowForm(false);
      setForm(EMPTY_FORM);
      setImageFile(null);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create article.');
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch { alert('Failed to delete article.'); }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div className="border-l-4 border-yellow-500 pl-6">
          <p className="text-yellow-400 text-xs uppercase tracking-[0.3em] mb-2">Admin</p>
          <h1 className="section-title">News Manager</h1>
        </div>
        <button onClick={showForm ? () => setShowForm(false) : openCreateForm} className="btn-claret">
          {showForm ? 'Cancel' : '+ New Article'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-dark-700 border border-white/10 p-8 mb-10 space-y-5">
          <h2 className="font-display text-2xl text-white uppercase tracking-wider mb-6">New Article</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Title *</label>
              <input required value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white/60 px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Category *</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Team</label>
              <select value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none">
                {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <MediaFileInput
                label="Article Image"
                kind="image"
                onChange={setImageFile}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Summary</label>
              <textarea rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Body (HTML)</label>
              <textarea rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none resize-y font-mono" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="accent-claret-800 w-4 h-4" />
              <label htmlFor="featured" className="text-white/60 text-sm uppercase tracking-widest">Featured Article</label>
            </div>
          </div>
          {saving && uploadProgress > 0 && (
            <div className="w-full bg-dark-800 h-1.5">
              <div className="bg-yellow-500 h-1.5 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}

          {formError && <p className="text-red-400 text-xs uppercase tracking-widest">{formError}</p>}
          <button type="submit" disabled={saving} className="btn-claret">
            {saving ? `Publishing... ${uploadProgress}%` : 'Publish Article'}
          </button>
        </form>
      )}

      {loading && <Spinner />}
      {error && <ErrorMessage />}

      {!loading && !error && (
        <div className="space-y-2">
          {articles.map((a) => (
            <div key={a._id} className="flex items-center gap-5 bg-dark-700 hover:bg-dark-600 px-5 py-4 transition-all border border-white/5">
              <div className="w-16 h-12 flex-shrink-0 overflow-hidden bg-dark-600">
                <img src={a.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm uppercase tracking-wide truncate">{a.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <Badge color="claret" className="text-[10px]">{a.category}</Badge>
                  <span className="text-white/30 text-xs">{formatDate(a.publishedAt)}</span>
                  {a.featured && <Badge color="gold" className="text-[10px]">Featured</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link to={`/news/${a.slug}`} className="text-xs text-white/30 hover:text-white uppercase tracking-widest transition-colors">View</Link>
                <button onClick={() => handleDelete(a._id, a.title)}
                  className="text-xs text-red-500/60 hover:text-red-400 uppercase tracking-widest transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default AdminNews;
