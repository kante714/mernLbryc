import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Spinner, ErrorMessage } from '../ui';

const FORM_COLORS = { W: 'bg-green-500', D: 'bg-yellow-500', L: 'bg-red-600' };

const FormDot = ({ r }) => (
  <span className={`w-4 h-4 rounded-full ${FORM_COLORS[r] || 'bg-white/20'}
                    flex items-center justify-center text-[8px] text-white font-bold flex-shrink-0`}>
    {r}
  </span>
);

const LeagueTable = ({ highlightTeam = 'Likhu Bhujee RYC' }) => {
  const [standings, setStandings] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    api.get('/standings')
      .then(({ data }) => setStandings(data.standings))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="sm" />;
  if (error)   return <ErrorMessage message="Could not load table." />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            {['#', 'Team', 'P', 'W', 'D', 'L', 'GD', 'Pts', 'Form'].map((h) => (
              <th key={h}
                className={`py-3 px-2 text-white/30 text-xs uppercase tracking-widest font-medium
                  ${h === 'Team' ? 'text-left min-w-[120px]' : 'text-center'}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => {
            const hi = row.teamName === highlightTeam;
            return (
              <tr key={row._id}
                className={`border-b border-white/5 transition-colors
                  ${hi ? 'bg-claret-900/60 border-l-2 border-l-claret-600' : 'hover:bg-white/5'}`}>

                {/* Position */}
                <td className="py-3 px-2 text-center">
                  <span className={`text-xs font-bold
                    ${row.position <= 2 ? 'text-green-400' : row.position <= 6 ? 'text-yellow-400' : 'text-white/40'}`}>
                    {row.position}
                  </span>
                </td>

                {/* Team */}
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    {row.logoUrl && (
                      <img src={row.logoUrl} alt="" className="w-5 h-5 object-contain flex-shrink-0" />
                    )}
                    <span className={`font-semibold text-xs uppercase tracking-wide
                      ${hi ? 'text-yellow-400' : 'text-white'}`}>
                      {row.teamName}
                    </span>
                  </div>
                </td>

                {/* P W D L */}
                {[row.played, row.won, row.drawn, row.lost].map((v, i) => (
                  <td key={i} className="py-3 px-2 text-center text-white/50 text-xs">{v}</td>
                ))}

                {/* GD */}
                <td className={`py-3 px-2 text-center text-xs font-semibold
                  ${row.goalDifference > 0 ? 'text-green-400' : row.goalDifference < 0 ? 'text-red-400' : 'text-white/40'}`}>
                  {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                </td>

                {/* PTS */}
                <td className="py-3 px-2 text-center">
                  <span className={`font-bold text-sm ${hi ? 'text-white' : 'text-white/80'}`}>
                    {row.points}
                  </span>
                </td>

                {/* Form */}
                <td className="py-3 px-2">
                  <div className="flex gap-0.5">
                    {(row.form || '').split('').map((r, i) => <FormDot key={i} r={r} />)}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex items-center gap-4 px-2 pt-3 pb-1 border-t border-white/5 mt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
          <span className="text-white/30 text-[10px] uppercase tracking-widest">Promotion</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
          <span className="text-white/30 text-[10px] uppercase tracking-widest">Play-offs</span>
        </div>
      </div>
    </div>
  );
};

export default LeagueTable;
