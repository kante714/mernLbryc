import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchNextMatch } from '../../api/matchesApi';
import { formatMatchDate, formatMatchTime } from '../../utils/formatDate';

const HeroBanner = () => {
  const [nextMatch, setNextMatch] = useState(null);

  useEffect(() => {
    fetchNextMatch('men')
      .then(({ data }) => setNextMatch(data.match))
      .catch(() => {});
  }, []);

  return (
    <div className="relative w-full h-[85vh] min-h-[540px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=80')` }} />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/70 to-dark-900/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />

      {/* Claret accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-claret-800" />

      {/* Hero content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-end pb-24 md:pb-32">
        <div className="max-w-2xl">
          <span className="inline-block text-yellow-400 text-xs font-semibold uppercase tracking-[0.3em] mb-4 border border-yellow-500/30 px-3 py-1">
            Official Website
          </span>
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl text-white leading-none tracking-wider uppercase mb-4">
            Born To<br /><span className="text-claret-400">Lead</span>
          </h1>
          <p className="text-white/60 text-base leading-relaxed mb-8 max-w-lg">
            Follow every match, get the latest news, and go behind the scenes with your Likhu Bhujee RYC.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/matches" className="btn-claret px-8 py-3">Fixtures</Link>
            <Link to="/news"    className="btn-outline px-8 py-3">Latest News</Link>
          </div>
        </div>
      </div>

      {/* Bottom bar — next match or last result */}
      <div className="absolute bottom-0 left-0 right-0 bg-dark-900/90 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-13 py-3 gap-4">
          {nextMatch ? (
            <div className="flex items-center gap-4 overflow-hidden">
              <span className="text-claret-400 text-xs uppercase tracking-widest font-semibold flex-shrink-0">
                Next Match
              </span>
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-white font-semibold text-xs uppercase truncate">{nextMatch.homeTeam}</span>
                <span className="text-white/30 text-xs font-bold">vs</span>
                <span className="text-white font-semibold text-xs uppercase truncate">{nextMatch.awayTeam}</span>
                <span className="text-white/30 text-xs hidden sm:inline">·</span>
                <span className="text-white/50 text-xs hidden sm:inline uppercase tracking-widest flex-shrink-0">
                  {formatMatchDate(nextMatch.date)} {formatMatchTime(nextMatch.date)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-white/30 text-xs uppercase tracking-widest">Latest</span>
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-xs font-semibold uppercase">Lbryc</span>
                <span className="bg-claret-800 text-white text-xs font-bold px-2 py-0.5">1 — 0</span>
                <span className="text-white/80 text-xs font-semibold uppercase">Bamti Bhandar</span>
                <span className="text-white/30 text-xs ml-1">FT</span>
              </div>
            </div>
          )}
          <Link to="/matches"
            className="text-xs text-white/30 hover:text-yellow-400 uppercase tracking-widest flex-shrink-0 transition-colors">
            All Fixtures →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
