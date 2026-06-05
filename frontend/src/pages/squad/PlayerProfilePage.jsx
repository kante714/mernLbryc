import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPlayer } from '../../api/playersApi';
import { Spinner, ErrorMessage, Badge } from '../../components/ui';
import { formatDate } from '../../utils/formatDate';

const StatBox = ({ label, value, accent = false }) => (
  <div className={`flex flex-col items-center py-6 px-4 ${accent ? 'bg-claret-800' : 'bg-dark-700'}`}>
    <span className={`font-display text-5xl ${accent ? 'text-yellow-400' : 'text-white'}`}>{value ?? 0}</span>
    <span className="text-white/40 text-xs uppercase tracking-widest mt-1">{label}</span>
  </div>
);

const InfoRow = ({ label, value }) =>
  value !== null && value !== undefined && value !== '' ? (
    <div className="flex justify-between py-3 border-b border-white/5">
      <span className="text-white/40 text-xs uppercase tracking-widest">{label}</span>
      <span className="text-white text-sm font-medium uppercase tracking-wide">{value}</span>
    </div>
  ) : null;

const PlayerProfilePage = () => {
  const { slug }   = useParams();
  const [player,   setPlayer]  = useState(null);
  const [loading,  setLoading] = useState(true);
  const [error,    setError]   = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchPlayer(slug)
      .then(({ data }) => setPlayer(data.player))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="py-32"><Spinner /></div>;
  if (error || !player) return <div className="py-32"><ErrorMessage message="Player not found." /></div>;

  const isGK    = player.position === 'goalkeeper';
  const isStaff = player.position === 'coaching-staff';

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-dark-800 border-b border-white/10">
        <div className="absolute inset-0 bg-claret-gradient opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-10">

            {/* Photo */}
            <div className="relative w-56 md:w-72 flex-shrink-0">
              <img
                src={player.photoUrl || 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400'}
                alt={player.name}
                className="w-full aspect-[3/4] object-cover object-top"
              />
              {player.shirtNumber && (
                <div className="absolute top-0 right-0 w-12 h-12 bg-claret-800 flex items-center justify-center">
                  <span className="font-display text-white text-2xl">{player.shirtNumber}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 pb-2">
              <Badge color="claret" className="mb-4">
                {player.position.replace(/-/g, ' ')}
              </Badge>
              <h1 className="font-display text-5xl md:text-7xl text-white uppercase tracking-wider leading-none mb-4">
                {player.name}
              </h1>
              <div className="flex flex-wrap items-center gap-5 text-xs text-white/40 uppercase tracking-widest">
                {player.nationality && <span>{player.nationality}</span>}
                {player.dateOfBirth && <span>Born: {formatDate(player.dateOfBirth)}</span>}
                {player.height      && <span>Height: {player.height}</span>}
                {player.onLoan      && <Badge color="gold">On Loan</Badge>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Stats */}
            {!isStaff && (
              <div>
                <h2 className="font-display text-2xl text-white uppercase tracking-wider mb-5">Season Stats</h2>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  <StatBox label="Apps"    value={player.stats?.appearances ?? 0} accent />
                  {isGK
                    ? <StatBox label="Clean Sheets" value={player.stats?.cleanSheets ?? 0} />
                    : <StatBox label="Goals"        value={player.stats?.goals       ?? 0} />
                  }
                  <StatBox label="Assists" value={player.stats?.assists     ?? 0} />
                  <StatBox label="Yellow"  value={player.stats?.yellowCards ?? 0} />
                  <StatBox label="Red"     value={player.stats?.redCards    ?? 0} />
                </div>
              </div>
            )}

            {/* Bio */}
            {player.bio && (
              <div>
                <h2 className="font-display text-2xl text-white uppercase tracking-wider mb-5">Profile</h2>
                <div className="bg-dark-700 p-6 border-l-2 border-claret-800">
                  <p className="text-white/60 leading-relaxed text-sm">{player.bio}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-dark-700 p-6">
              <h3 className="font-display text-lg text-white uppercase tracking-wider mb-4">Player Details</h3>
              <InfoRow label="Squad"       value={player.squad} />
              <InfoRow label="Position"    value={player.position?.replace(/-/g,' ')} />
              <InfoRow label="Nationality" value={player.nationality} />
              <InfoRow label="Height"      value={player.height} />
              <InfoRow label="Shirt No."   value={player.shirtNumber} />
            </div>
            <Link to="/squad" className="btn-outline w-full text-center block text-xs">
              ← Back to Squad
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PlayerProfilePage;
