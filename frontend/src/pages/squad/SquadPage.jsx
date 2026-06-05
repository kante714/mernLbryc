import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchPlayers } from '../../api/playersApi';
import PlayerCard from '../../components/squad/PlayerCard';
import { TabFilter, Spinner, ErrorMessage, EmptyState } from '../../components/ui';

const SQUAD_TABS = [
  { value: 'men',       label: 'Men' },
  { value: 'women',     label: 'Women' },
  { value: 'under-21',  label: 'Under 21' },
  { value: 'under-18',  label: 'Under 18' },
];

const POSITION_TABS = [
  { value: '',               label: 'All' },
  { value: 'goalkeeper',     label: 'Goalkeepers' },
  { value: 'defender',       label: 'Defenders' },
  { value: 'midfielder',     label: 'Midfielders' },
  { value: 'forward',        label: 'Forwards' },
  { value: 'coaching-staff', label: 'Staff' },
];

const POS_ORDER  = ['goalkeeper','defender','midfielder','forward','coaching-staff'];
const POS_TITLES = {
  goalkeeper:       'Goalkeepers',
  defender:         'Defenders',
  midfielder:       'Midfielders',
  forward:          'Forwards',
  'coaching-staff': 'Coaching Staff',
};

const SquadPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [squad,    setSquad]    = useState(searchParams.get('squad') || 'men');
  const [position, setPosition] = useState('');
  const [players,  setPlayers]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    setLoading(true);
    setSearchParams({ squad });
    fetchPlayers({ squad, position: position || undefined })
      .then(({ data }) => { setPlayers(data.players); setError(null); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [squad, position]);

  const grouped = POS_ORDER.reduce((acc, pos) => {
    const g = players.filter((p) => p.position === pos);
    if (g.length) acc[pos] = g;
    return acc;
  }, {});

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="border-l-4 border-claret-800 pl-6 mb-10">
        <p className="text-claret-400 text-xs uppercase tracking-[0.3em] mb-2 font-semibold">Burnley FC</p>
        <h1 className="section-title">Squad</h1>
      </div>

      {/* Squad tabs */}
      <TabFilter
        tabs={SQUAD_TABS}
        active={squad}
        onChange={(v) => { setSquad(v); setPosition(''); }}
        className="mb-4"
      />

      {/* Position filter */}
      <TabFilter
        tabs={POSITION_TABS}
        active={position}
        onChange={setPosition}
        className="mb-10"
      />

      {loading && <Spinner />}
      {error   && <ErrorMessage />}
      {!loading && !error && players.length === 0 && <EmptyState message="No players found." />}

      {!loading && !error && players.length > 0 && (
        position
          /* Filtered by position — flat grid */
          ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {players.map((p) => <PlayerCard key={p._id} player={p} />)}
            </div>
          )
          /* All — grouped by position */
          : Object.entries(grouped).map(([pos, group]) => (
            <div key={pos} className="mb-14">
              <h2 className="font-display text-2xl text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-3">
                {POS_TITLES[pos]}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {group.map((p) => <PlayerCard key={p._id} player={p} />)}
              </div>
            </div>
          ))
      )}
    </main>
  );
};

export default SquadPage;
