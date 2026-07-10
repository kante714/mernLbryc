import { useState, useEffect } from 'react';
import { fetchMatches, createMatch, updateMatch, deleteMatch } from '../../api/matchesApi';
import { Spinner, ErrorMessage, EmptyState, Badge, TabFilter } from '../../components/ui';
import { formatMatchDate, formatMatchTime } from '../../utils/formatDate';
import MediaFileInput from '../../components/admin/MediaFileInput';

const STATUSES = ['upcoming', 'live', 'result'];
const TEAMS = ['men', 'women', 'under-21', 'under-18'];
const TEAM_TABS = [{ value: '', label: 'All' }, ...TEAMS.map((t) => ({ value: t, label: t }))];

const EMPTY_FORM = {
  homeTeam: '', awayTeam: '', date: '', venue: '', competition: 'Championship',
  status: 'upcoming', team: 'men', homeScore: '', awayScore: '',
  broadcastInfo: '', matchReportSlug: '', ticketUrl: '',
};

// datetime-local inputs need "YYYY-MM-DDTHH:mm" — simple UTC-based slice,
// same level of timezone handling as the rest of this admin area.
const toLocalInput = (isoDate) => (isoDate ? new Date(isoDate).toISOString().slice(0, 16) : '');

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [teamFilter, setTeamFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null); // null = create mode
  const [form, setForm] = useState(EMPTY_FORM);
  const [homeLogoFile, setHomeLogoFile] = useState(null);
  const [awayLogoFile, setAwayLogoFile] = useState(null);
  const [competitionLogoFile, setCompetitionLogoFile] = useState(null);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const load = () => {
    setLoading(true);
    fetchMatches({ team: teamFilter || undefined })
      .then(({ data }) => { setMatches(data.matches); setError(null); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [teamFilter]);

  const openCreateForm = () => {
    setEditingMatch(null);
    setForm(EMPTY_FORM);
    setHomeLogoFile(null);
    setAwayLogoFile(null);
    setCompetitionLogoFile(null);
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (match) => {
    setEditingMatch(match);
    setForm({
      homeTeam: match.homeTeam, awayTeam: match.awayTeam,
      date: toLocalInput(match.date), venue: match.venue || '',
      competition: match.competition, status: match.status, team: match.team,
      homeScore: match.homeScore ?? '', awayScore: match.awayScore ?? '',
      broadcastInfo: match.broadcastInfo || '', matchReportSlug: match.matchReportSlug || '',
      ticketUrl: match.ticketUrl || '',
    });
    setHomeLogoFile(null);
    setAwayLogoFile(null);
    setCompetitionLogoFile(null);
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
    formData.append('homeTeam', form.homeTeam);
    formData.append('awayTeam', form.awayTeam);
    formData.append('date', new Date(form.date).toISOString());
    formData.append('venue', form.venue);
    formData.append('competition', form.competition);
    formData.append('status', form.status);
    formData.append('team', form.team);
    if (form.homeScore !== '') formData.append('homeScore', form.homeScore);
    if (form.awayScore !== '') formData.append('awayScore', form.awayScore);
    formData.append('broadcastInfo', form.broadcastInfo);
    formData.append('matchReportSlug', form.matchReportSlug);
    formData.append('ticketUrl', form.ticketUrl);
    if (homeLogoFile) formData.append('homeTeamLogo', homeLogoFile);
    if (awayLogoFile) formData.append('awayTeamLogo', awayLogoFile);
    if (competitionLogoFile) formData.append('competitionLogo', competitionLogoFile);

    const onUploadProgress = (evt) => {
      if (evt.total) setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
    };

    try {
      if (editingMatch) {
        await updateMatch(editingMatch._id, formData, onUploadProgress);
      } else {
        await createMatch(formData, onUploadProgress);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save match.');
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id, label) => {
    if (!window.confirm(`Delete "${label}"? Team/competition badges are shared and won't be removed from Cloudinary.`)) return;
    try {
      await deleteMatch(id);
      setMatches((prev) => prev.filter((m) => m._id !== id));
    } catch {
      alert('Failed to delete match.');
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div className="border-l-4 border-yellow-500 pl-6">
          <p className="text-yellow-400 text-xs uppercase tracking-[0.3em] mb-2">Admin</p>
          <h1 className="section-title">Match Manager</h1>
        </div>
        <button onClick={showForm ? closeForm : openCreateForm} className="btn-claret">
          {showForm ? 'Cancel' : '+ New Match'}
        </button>
      </div>

      {/* Create / edit form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-dark-700 border border-white/10 p-8 mb-10 space-y-5">
          <h2 className="font-display text-2xl text-white uppercase tracking-wider mb-6">
            {editingMatch ? 'Edit Match' : 'New Match'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Home Team *</label>
              <input required value={form.homeTeam} onChange={(e) => setForm({ ...form, homeTeam: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Away Team *</label>
              <input required value={form.awayTeam} onChange={(e) => setForm({ ...form, awayTeam: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Date & Time *</label>
              <input required type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Venue</label>
              <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Competition</label>
              <input value={form.competition} onChange={(e) => setForm({ ...form, competition: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Squad</label>
              <select value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none">
                {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Home Score</label>
                <input type="number" value={form.homeScore} onChange={(e) => setForm({ ...form, homeScore: e.target.value })}
                  className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Away Score</label>
                <input type="number" value={form.awayScore} onChange={(e) => setForm({ ...form, awayScore: e.target.value })}
                  className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Broadcast Info</label>
              <input placeholder="Live on YouTube" value={form.broadcastInfo} onChange={(e) => setForm({ ...form, broadcastInfo: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Match Report Slug</label>
              <input value={form.matchReportSlug} onChange={(e) => setForm({ ...form, matchReportSlug: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white/60 px-4 py-3 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Ticket URL</label>
              <input value={form.ticketUrl} onChange={(e) => setForm({ ...form, ticketUrl: e.target.value })}
                className="w-full bg-dark-800 border border-white/10 focus:border-claret-700 text-white/60 px-4 py-3 text-sm outline-none" />
            </div>

            <div className="md:col-span-2 border-t border-white/10 pt-5">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Team & Competition Badges</p>
              <p className="text-white/20 text-[10px] uppercase tracking-widest mb-4">
                Shared by name — uploading "{form.homeTeam || 'a team'}"'s badge here updates it everywhere that team appears
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <MediaFileInput label="Home Badge" kind="image" existingUrl={editingMatch?.homeTeamLogo || ''} onChange={setHomeLogoFile} />
                <MediaFileInput label="Away Badge" kind="image" existingUrl={editingMatch?.awayTeamLogo || ''} onChange={setAwayLogoFile} />
                <MediaFileInput label="Competition Badge" kind="image" existingUrl={editingMatch?.competitionLogo || ''} onChange={setCompetitionLogoFile} />
              </div>
            </div>
          </div>

          {saving && uploadProgress > 0 && (
            <div className="w-full bg-dark-800 h-1.5">
              <div className="bg-yellow-500 h-1.5 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}

          {formError && <p className="text-red-400 text-xs uppercase tracking-widest">{formError}</p>}

          <button type="submit" disabled={saving} className="btn-claret">
            {saving ? `Saving... ${uploadProgress}%` : editingMatch ? 'Save Changes' : 'Add Match'}
          </button>
        </form>
      )}

      <TabFilter tabs={TEAM_TABS} active={teamFilter} onChange={setTeamFilter} className="mb-8" />

      {loading && <Spinner />}
      {error && <ErrorMessage />}
      {!loading && !error && matches.length === 0 && <EmptyState message="No matches found." />}

      {!loading && !error && matches.length > 0 && (
        <div className="space-y-2">
          {matches.map((m) => (
            <div key={m._id} className="flex items-center gap-5 bg-dark-700 hover:bg-dark-600 px-5 py-4 transition-all border border-white/5">
              <div className="flex -space-x-2 flex-shrink-0">
                {[m.homeTeamLogo, m.awayTeamLogo].map((url, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-dark-600 border border-dark-700 overflow-hidden">
                    {url && <img src={url} alt="" className="w-full h-full object-contain p-0.5" />}
                  </div>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm uppercase tracking-wide truncate">
                  {m.homeTeam} vs {m.awayTeam}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <Badge color="claret" className="text-[10px]">{m.competition}</Badge>
                  <Badge color="white" className="text-[10px]">{m.status}</Badge>
                  <span className="text-white/30 text-xs">{formatMatchDate(m.date)} · {formatMatchTime(m.date)}</span>
                  {m.status === 'result' && <span className="text-white/30 text-xs font-mono">{m.homeScore}–{m.awayScore}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={() => openEditForm(m)}
                  className="text-xs text-white/30 hover:text-white uppercase tracking-widest transition-colors">Edit</button>
                <button onClick={() => handleDelete(m._id, `${m.homeTeam} vs ${m.awayTeam}`)}
                  className="text-xs text-red-500/60 hover:text-red-400 uppercase tracking-widest transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default AdminMatches;
