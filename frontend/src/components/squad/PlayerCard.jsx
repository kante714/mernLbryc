import { Link } from 'react-router-dom';
import { Badge } from '../ui';

const POSITION_COLORS = {
  goalkeeper: 'gold',
  defender: 'green',
  midfielder: 'claret',
  forward: 'white',
  'coaching-staff': 'white',
};

const POSITION_LABELS = {
  goalkeeper: 'GK', defender: 'DEF', midfielder: 'MID',
  forward: 'FWD', 'coaching-staff': 'Staff',
};

const PlayerCard = ({ player }) => (
  <Link to={`/player/${player.slug}`} className="group block bg-dark-700 hover:bg-dark-600 transition-all duration-300 card-hover overflow-hidden">
    {/* Image */}
    <div className="relative aspect-[3/4] overflow-hidden bg-dark-600">
      <img
        src={player.photoUrl || `https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=400`}
        alt={player.name}
        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/10 to-transparent" />

      {/* Shirt number */}
      {player.shirtNumber && (
        <div className="absolute top-3 right-3 w-9 h-9 bg-claret-800 flex items-center justify-center">
          <span className="font-display text-white text-lg leading-none">{player.shirtNumber}</span>
        </div>
      )}

      {/* On loan badge */}
      {player.onLoan && (
        <div className="absolute top-3 left-3">
          <Badge color="gold">On Loan</Badge>
        </div>
      )}

      {/* Name overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <Badge color={POSITION_COLORS[player.position]} className="mb-2 text-[10px]">
          {POSITION_LABELS[player.position]}
        </Badge>
        <h3 className="font-display text-xl text-white uppercase tracking-wider leading-tight group-hover:text-yellow-400 transition-colors">
          {player.name}
        </h3>
        {player.nationality && (
          <p className="text-white/40 text-xs uppercase tracking-widest mt-1">{player.nationality}</p>
        )}
      </div>
    </div>

    {/* Stats bar */}
    {player.position !== 'coaching-staff' && (
      <div className="grid grid-cols-3 divide-x divide-white/5 border-t border-white/5">
        {[
          { label: 'Apps', val: player.stats?.appearances ?? 0 },
          { label: player.position === 'goalkeeper' ? 'CS' : 'Goals', val: player.position === 'goalkeeper' ? player.stats?.cleanSheets ?? 0 : player.stats?.goals ?? 0 },
          { label: 'Assists', val: player.stats?.assists ?? 0 },
        ].map(({ label, val }) => (
          <div key={label} className="py-3 text-center">
            <p className="font-display text-xl text-white">{val}</p>
            <p className="text-white/30 text-[10px] uppercase tracking-widest">{label}</p>
          </div>
        ))}
      </div>
    )}
  </Link>
);

export default PlayerCard;
