import { Link } from 'react-router-dom';
import { formatMatchDate, formatMatchTime } from '../../utils/formatDate';
import { Badge } from '../ui';

const Crest = ({ name, logoUrl }) => (
  <div className="flex flex-col items-center gap-2 w-28 md:w-36 flex-shrink-0">
    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden">
      {logoUrl ? (
        <img src={logoUrl} alt="" className="w-full h-full object-contain p-1.5" />
      ) : (
        <span className="text-white/60 font-bold text-xs tracking-wider">
          {name.replace(/\s+(FC|United|City|Town|County|Rovers|Wanderers|Athletic|Wednesday|U21|U18|Women).*$/i, '')
               .slice(0, 3)
               .toUpperCase()}
        </span>
      )}
    </div>
    <span className="text-white font-semibold text-xs uppercase tracking-wide text-center leading-tight line-clamp-2">
      {name}
    </span>
  </div>
);

const MatchCard = ({ match }) => {
  const isResult  = match.status === 'result';
  const isLive    = match.status === 'live';
  const isUpcoming = match.status === 'upcoming';

  return (
    <div className="bg-dark-700 border border-white/5 hover:border-claret-800/40 transition-all duration-200">

      {/* Top bar — competition + venue */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/5">
        <span className="text-white/40 text-xs uppercase tracking-widest">{match.competition}</span>
        <div className="flex items-center gap-2 overflow-hidden">
          {isLive && <Badge color="live">Live</Badge>}
          <span className="text-white/25 text-xs uppercase tracking-widest truncate max-w-[200px]">
            {match.venue}
          </span>
        </div>
      </div>

      {/* Match body */}
      <div className="px-5 py-6 flex items-center justify-between gap-4">
        <Crest name={match.homeTeam} logoUrl={match.homeTeamLogo} />

        {/* Score or time */}
        <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
          {(isResult || isLive) ? (
            <>
              <div className="flex items-center gap-3">
                <span className="font-display text-5xl text-white tracking-wider">
                  {match.homeScore}
                </span>
                <span className="text-white/20 font-display text-3xl">—</span>
                <span className="font-display text-5xl text-white tracking-wider">
                  {match.awayScore}
                </span>
              </div>
              <Badge color={isLive ? 'live' : 'white'}>
                {isLive ? 'Live' : 'Full Time'}
              </Badge>
            </>
          ) : (
            <div className="text-center">
              <p className="font-display text-3xl text-white tracking-widest">
                {formatMatchTime(match.date)}
              </p>
              <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
                {formatMatchDate(match.date)}
              </p>
              {match.broadcastInfo && (
                <p className="text-white/25 text-xs uppercase tracking-widest mt-1.5">
                  {match.broadcastInfo}
                </p>
              )}
            </div>
          )}
        </div>

        <Crest name={match.awayTeam} logoUrl={match.awayTeamLogo} />
      </div>

      {/* Action bar */}
      <div className="px-5 py-3 border-t border-white/5 flex items-center gap-3 min-h-[44px]">
        {isResult && match.matchReportSlug && (
          <Link to={`/news/${match.matchReportSlug}`}
            className="text-xs text-yellow-400 hover:text-yellow-300 uppercase tracking-widest transition-colors">
            Match Report →
          </Link>
        )}
        {isUpcoming && match.ticketUrl && (
          <a href={match.ticketUrl} target="_blank" rel="noreferrer"
            className="text-xs bg-claret-800 hover:bg-claret-700 text-white
                       px-4 py-1.5 uppercase tracking-widest transition-all duration-200">
            Buy Tickets
          </a>
        )}
        {isResult && !match.matchReportSlug && (
          <span className="text-white/20 text-xs uppercase tracking-widest">Full Time</span>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
