import { useState, useEffect } from 'react';
import { fetchPlayers, createPlayer, updatePlayer, deletePlayer } from '../../api/playersApi';
import { Spinner, ErrorMessage, EmptyState, Badge, TabFilter } from '../../components/ui';
import MediaFileInput from '../../components/admin/MediaFileInput';

const POSITIONS = ['goalkeeper', 'defender', 'midfielder', 'forward', 'coaching-staff'];
const SQUADS = ['men', 'women', 'under-21', 'under-18', 'e-sports'];
const SQUAD_TABS = [{ value: '', label: 'All' }, ...SQUADS.map((s) => ({ value: s, label: s }))];

const EMPTY_STATS = { appearances: 0, goals: 0, assists: 0, cleanSheets: 0, yellowCards: 0, redCards: 0 };
const EMPTY_FORM = {
  name: '', slug: '', position: 'goalkeeper', squad: 'men', shirtNumber: '',
  nationality: '', onLoan: false, bio: '', dateOfBirth: '', height: '', stats: EMPTY_STATS,
};

const slugify = (str) => str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

const AdminPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [squadFilter, setSquadFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null); // null = create mode
  const [form, setForm] = useState(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState(null);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const load = () => {
    setLoading(true);
    fetchPlayers({ squad: squadFilter || undefined })
      .then(({ data }) => { setPlayers(data.players); setError(null); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [squadFilter]);

  const openCreateForm = () => {
    setEditingPlayer(null);
    setForm(EMPTY_FORM);
    setPhotoFile(null);
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (player) => {
    setEditingPlayer(player);
    setForm({
      name: player.name,
      slug: player.slug,
      position: player.position,
      squad: player.squad,
      shirtNumber: player.shirtNumber ?? '',
      nationality: player.nationality || '',
      onLoan: player.onLoan,
      bio: player.bio || '',
      dateOfBirth: player.dateOfBirth ? player.dateOfBirth.slice(0, 10) : '',
      height: player.height || '',
      stats: { ...EMPTY_STATS, ...player.stats },
    });
    setPhotoFile(null);
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const handleNameChange = (name) => setForm((f) => ({ ...f, name, slug: editingPlayer ? f.slug : slugify(name) }));
  const handleStatChange = (key, value) => setForm((f) => ({ ...f, stats: { ...f.stats, [key]: value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('slug', form.slug);
    formData.append('position', form.position);
    formData.append('squad', form.squad);
    if (form.shirtNumber !== '') formData.append('shirtNumber', form.shirtNumber);
    formData.append('nationality', form.nationality);
    formData.append('onLoan', form.onLoan);
    formData.append('bio', form.bio);
    if (form.dateOfBirth) formData.append('dateOfBirth', form.dateOfBirth);
    formData.append('height', form.height);
    formData.append('stats', JSON.stringify(form.stats)); // nested object → JSON string, parsed server-side
    if (photoFile) formData.append('photo', photoFile);

    const onUploadProgress = (evt) => {
      if (evt.total) setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
    };

    try {
      if (editingPlayer) {
        await updatePlayer(editingPlayer._id, formData, onUploadProgress);
      } else {
        await createPlayer(formData, onUploadProgress);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save player.');
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This also removes their photo from Cloudinary.`)) return;
    try {
      await deletePlayer(id);
      setPlayers((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert('Failed to delete player.');
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div className="border-l-4 border-yellow-500 pl-6">
          <p className="text-yellow-400 text-xs uppercase tracking-[0.3em] mb-2">Admin</p>
          <h1 className="section-title">Squad Manager</h1>
        </div>
        <button onClick={showForm ? closeForm : openCreateForm} className="btn-claret">
          {showForm ? 'Cancel' : '+ New Player'}
        </button>
      </div>

      {/* Create / edit form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-dark-700 border border-white/10 p-8 mb-10 space-y-5">
          <h2 className="font-display text-2xl text-white uppercase tracking-wider mb-6">
            {editingPlayer ? 'Edit Player' : 'New Player'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Name *</label>
              <input required value={form.name} onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white/60 px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Position *</label>
              <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none">
                {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Squad</label>
              <select value={form.squad} onChange={(e) => setForm({ ...form, squad: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none">
                {SQUADS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Shirt Number</label>
              <input type="number" value={form.shirtNumber} onChange={(e) => setForm({ ...form, shirtNumber: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Nationality</label>
              <input value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Date of Birth</label>
              <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Height</label>
              <input placeholder={`5'9"`} value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
            </div>
            <div className="flex items-center gap-3 pt-7">
              <input type="checkbox" id="onLoan" checked={form.onLoan} onChange={(e) => setForm({ ...form, onLoan: e.target.checked })}
                className="accent-claret-800 w-4 h-4" />
              <label htmlFor="onLoan" className="text-white/60 text-sm uppercase tracking-widest">On Loan</label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Bio</label>
              <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none resize-none" />
            </div>

            {/* Stats */}
            <div className="md:col-span-2">
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Stats</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {Object.keys(EMPTY_STATS).map((key) => (
                  <div key={key}>
                    <input type="number" min="0" value={form.stats[key]} onChange={(e) => handleStatChange(key, e.target.value)}
                      className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-3 py-2 text-sm outline-none" />
                    <p className="text-white/20 text-[10px] mt-1 uppercase tracking-widest truncate">{key}</p>
                  </div>
                ))}
              </div>
            </div>

            <MediaFileInput
              label="Photo"
              kind="image"
              existingUrl={editingPlayer?.photoUrl || ''}
              onChange={setPhotoFile}
              required={!editingPlayer}
            />
          </div>

          {saving && uploadProgress > 0 && (
            <div className="w-full bg-dark-800 h-1.5">
              <div className="bg-yellow-500 h-1.5 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}

          {formError && <p className="text-red-400 text-xs uppercase tracking-widest">{formError}</p>}

          <button type="submit" disabled={saving} className="btn-claret">
            {saving ? `Uploading... ${uploadProgress}%` : editingPlayer ? 'Save Changes' : 'Add Player'}
          </button>
        </form>
      )}

      <TabFilter tabs={SQUAD_TABS} active={squadFilter} onChange={setSquadFilter} className="mb-8" />

      {loading && <Spinner />}
      {error && <ErrorMessage />}
      {!loading && !error && players.length === 0 && <EmptyState message="No players found." />}

      {!loading && !error && players.length > 0 && (
        <div className="space-y-2">
          {players.map((p) => (
            <div key={p._id} className="flex items-center gap-5 bg-dark-700 hover:bg-dark-600 px-5 py-4 transition-all border border-white/5">
              <div className="w-12 h-12 flex-shrink-0 overflow-hidden bg-dark-600 rounded-full">
                {p.photoUrl && <img src={p.photoUrl} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm uppercase tracking-wide truncate">
                  {p.shirtNumber ? `#${p.shirtNumber} ` : ''}{p.name}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <Badge color="claret" className="text-[10px]">{p.position}</Badge>
                  <Badge color="white" className="text-[10px]">{p.squad}</Badge>
                  {p.onLoan && <Badge color="gold" className="text-[10px]">On Loan</Badge>}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={() => openEditForm(p)}
                  className="text-xs text-white/30 hover:text-white uppercase tracking-widest transition-colors">Edit</button>
                <button onClick={() => handleDelete(p._id, p.name)}
                  className="text-xs text-red-500/60 hover:text-red-400 uppercase tracking-widest transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default AdminPlayers;
