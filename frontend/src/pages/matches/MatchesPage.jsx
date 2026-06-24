import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchMatches } from '../../api/matchesApi';
import MatchCard from '../../components/matches/MatchCard';
import LeagueTable from '../../components/matches/LeagueTable';
import { TabFilter, Spinner, ErrorMessage, EmptyState } from '../../components/ui';

const TEAM_TABS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'under-21', label: 'Under 21' },
  { value: 'under-18', label: 'Under 18' },
];

const STATUS_TABS = [
  { value: 'upcoming', label: 'Fixtures' },
  { value: 'result', label: 'Results' },
];

const MatchesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [team, setTeam] = useState(searchParams.get('team') || 'men');
  const [status, setStatus] = useState('upcoming');
  const [matches, setMatches] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setSearchParams({ team });
    fetchMatches({ team, status })
      .then(({ data }) => { setMatches(data.matches); setError(null); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [team, status]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="border-l-4 border-claret-800 pl-6 mb-10">
        <p className="text-claret-400 text-xs uppercase tracking-[0.3em] mb-2 font-semibold">Schedule</p>
        <h1 className="section-title">Fixtures & Results</h1>
      </div>

      {/* Team tabs */}
      <TabFilter tabs={TEAM_TABS} active={team} onChange={(v) => { setTeam(v); setStatus('upcoming'); }} className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Matches list */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <TabFilter tabs={STATUS_TABS} active={status} onChange={setStatus} />
          </div>

          {loading && <Spinner />}
          {error && <ErrorMessage />}
          {!loading && !error && matches.length === 0 && (
            <EmptyState message={`No ${status === 'upcoming' ? 'fixtures' : 'results'} for this team.`} />
          )}
          {!loading && !error && matches.length > 0 && (
            <div className="space-y-3">
              {matches.map((m) => <MatchCard key={m._id} match={m} />)}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Table toggle */}
          {team === 'men' && (
            <div className="bg-dark-700 border border-white/5">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <h3 className="font-display text-lg text-white uppercase tracking-wider">League Table</h3>
                <button onClick={() => setShowTable(!showTable)}
                  className="text-xs text-white/40 hover:text-white uppercase tracking-widest transition-colors">
                  {showTable ? 'Hide' : 'Show'}
                </button>
              </div>
              {showTable && (
                <div className="p-3">
                  <LeagueTable highlightTeam="Likhu Bhujee RYC" />
                </div>
              )}
              {!showTable && (
                <button onClick={() => setShowTable(true)}
                  className="w-full py-8 text-white/20 hover:text-white/50 text-xs uppercase tracking-widest transition-colors">
                  Click to view table
                </button>
              )}
            </div>
          )}

          {/* Next match CTA */}
          <div className="bg-claret-gradient p-6">
            <p className="text-yellow-400 text-xs uppercase tracking-widest mb-1 font-semibold">Season Tickets</p>
            <h3 className="font-display text-2xl text-white uppercase tracking-wide mb-3">2025/26 Now On Sale</h3>
            <p className="text-white/60 text-xs leading-relaxed mb-5">
              Secure your seat at Amrit Gamchaya for the upcoming season.
            </p>
            <a href="#" target="_blank" rel="noreferrer"
              className="block text-center bg-yellow-500 hover:bg-yellow-400 text-dark-900 font-bold py-3 uppercase tracking-widest text-xs transition-all duration-200">
              Buy Season Ticket
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MatchesPage;
