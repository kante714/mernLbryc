import { useState, useEffect } from 'react';
import { fetchStandings, createStanding, updateStanding, deleteStanding } from '../../api/standingsApi';
import { Spinner, ErrorMessage, EmptyState, Badge } from '../../components/ui';
import MediaFileInput from '../../components/admin/MediaFileInput';

const STAT_FIELDS = ['played', 'won', 'drawn', 'lost', 'goalsFor', 'goalsAgainst', 'goalDifference', 'points'];

const EMPTY_FORM = {
  season: '2024-25', teamName: '', teamCode: '', position: '',
  played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, form: '',
};

const AdminStandings = () => {
  const [season, setSeason] = useState('2024-25');
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingStanding, setEditingStanding] = useState(null); // null = create mode
  const [form, setForm] = useState(EMPTY_FORM);
  const [logoFile, setLogoFile] = useState(null);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const load = () => {
    setLoading(true);
    fetchStandings({ season })
      .then(({ data }) => { setStandings(data.standings); setError(null); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [season]);

  const openCreateForm = () => {
    setEditingStanding(null);
    setForm({ ...EMPTY_FORM, season });
    setLogoFile(null);
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (standing) => {
    setEditingStanding(standing);
    setForm({
      season: standing.season,
      teamName: standing.teamName,
      teamCode: standing.teamCode,
      position: standing.position,
      played: standing.played, won: standing.won, drawn: standing.drawn, lost: standing.lost,
      goalsFor: standing.goalsFor, goalsAgainst: standing.goalsAgainst,
      goalDifference: standing.goalDifference, points: standing.points,
      form: standing.form || '',
    });
    setLogoFile(null);
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const handleStatChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('season', form.season);
    formData.append('teamName', form.teamName);
    formData.append('teamCode', form.teamCode);
    formData.append('position', form.position);
    STAT_FIELDS.forEach((key) => formData.append(key, form[key]));
    formData.append('form', form.form);
    if (logoFile) formData.append('logo', logoFile);

    const onUploadProgress = (evt) => {
      if (evt.total) setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
    };

    try {
      if (editingStanding) {
        await updateStanding(editingStanding._id, formData, onUploadProgress);
      } else {
        await createStanding(formData, onUploadProgress);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save standing.');
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id, teamName) => {
    if (!window.confirm(`Remove "${teamName}" from the table? This also removes their logo from Cloudinary.`)) return;
    try {
      await deleteStanding(id);
      setStandings((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert('Failed to delete standing.');
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div className="border-l-4 border-yellow-500 pl-6">
          <p className="text-yellow-400 text-xs uppercase tracking-[0.3em] mb-2">Admin</p>
          <h1 className="section-title">Standings Manager</h1>
        </div>
        <button onClick={showForm ? closeForm : openCreateForm} className="btn-claret">
          {showForm ? 'Cancel' : '+ New Row'}
        </button>
      </div>

      {/* Create / edit form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-dark-700 border border-white/10 p-8 mb-10 space-y-5">
          <h2 className="font-display text-2xl text-white uppercase tracking-wider mb-6">
            {editingStanding ? 'Edit Standing' : 'New Standing'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Season *</label>
              <input required value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Position *</label>
              <input required type="number" min="1" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Team Name *</label>
              <input required value={form.teamName} onChange={(e) => setForm({ ...form, teamName: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Team Code *</label>
              <input required value={form.teamCode} onChange={(e) => setForm({ ...form, teamCode: e.target.value.toUpperCase() })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" maxLength={4} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Record</label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {STAT_FIELDS.map((key) => (
                  <div key={key}>
                    <input type="number" value={form[key]} onChange={(e) => handleStatChange(key, e.target.value)}
                      className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-3 py-2 text-sm outline-none" />
                    <p className="text-white/20 text-[10px] mt-1 uppercase tracking-widest truncate">{key}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Form <span className="normal-case text-white/20">(e.g. WDLLW)</span></label>
              <input value={form.form} onChange={(e) => setForm({ ...form, form: e.target.value.toUpperCase() })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" maxLength={5} />
            </div>

            <MediaFileInput
              label="Team Logo"
              kind="image"
              existingUrl={editingStanding?.logoUrl || ''}
              onChange={setLogoFile}
              required={false}
            />
          </div>

          {saving && uploadProgress > 0 && (
            <div className="w-full bg-dark-800 h-1.5">
              <div className="bg-yellow-500 h-1.5 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}

          {formError && <p className="text-red-400 text-xs uppercase tracking-widest">{formError}</p>}

          <button type="submit" disabled={saving} className="btn-claret">
            {saving ? `Saving... ${uploadProgress}%` : editingStanding ? 'Save Changes' : 'Add Row'}
          </button>
        </form>
      )}

      <div className="flex items-center gap-3 mb-8">
        <label className="text-xs text-white/40 uppercase tracking-widest">Season</label>
        <input value={season} onChange={(e) => setSeason(e.target.value)}
          className="bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-2 text-sm outline-none w-32" />
      </div>

      {loading && <Spinner />}
      {error && <ErrorMessage />}
      {!loading && !error && standings.length === 0 && <EmptyState message="No standings for this season yet." />}

      {!loading && !error && standings.length > 0 && (
        <div className="space-y-2">
          {standings.map((s) => (
            <div key={s._id} className="flex items-center gap-5 bg-dark-700 hover:bg-dark-600 px-5 py-4 transition-all border border-white/5">
              <span className="w-6 text-center text-white/40 font-bold text-sm flex-shrink-0">{s.position}</span>
              <div className="w-8 h-8 flex-shrink-0 overflow-hidden bg-dark-600 rounded-full">
                {s.logoUrl && <img src={s.logoUrl} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm uppercase tracking-wide truncate">{s.teamName}</p>
                <div className="flex items-center gap-3 mt-1">
                  <Badge color="white" className="text-[10px]">{s.teamCode}</Badge>
                  <span className="text-white/30 text-xs">P{s.played} · Pts {s.points} · GD {s.goalDifference > 0 ? '+' : ''}{s.goalDifference}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={() => openEditForm(s)}
                  className="text-xs text-white/30 hover:text-white uppercase tracking-widest transition-colors">Edit</button>
                <button onClick={() => handleDelete(s._id, s.teamName)}
                  className="text-xs text-red-500/60 hover:text-red-400 uppercase tracking-widest transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default AdminStandings;
