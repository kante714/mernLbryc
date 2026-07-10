import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const StatCard = ({ label, value, to, color = 'claret' }) => {
  const borders = {
    claret: 'border-claret-800',
    gold:   'border-yellow-500',
    green:  'border-green-600',
    blue:   'border-blue-500',
  };
  return (
    <Link to={to}
      className={`block bg-dark-700 hover:bg-dark-600 border-t-2 ${borders[color]} p-6 transition-all duration-200 group`}>
      <p className="text-white/40 text-xs uppercase tracking-widest mb-2">{label}</p>
      <p className="font-display text-5xl text-white group-hover:text-yellow-400 transition-colors">
        {value ?? '—'}
      </p>
      <p className="text-white/20 text-xs uppercase tracking-widest mt-3">Manage →</p>
    </Link>
  );
};

const AdminDashboard = () => {
  const [stats,   setStats]   = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      api.get('/news',    { params: { limit: 1 } }),
      api.get('/matches', { params: { limit: 1 } }),
      api.get('/players'),
      api.get('/videos'),
      api.get('/standings'),
    ]).then(([news, matches, players, videos, standings]) => {
      setStats({
        articles:  news.status      === 'fulfilled' ? news.value.data.total                   : '?',
        matches:   matches.status   === 'fulfilled' ? matches.value.data.matches?.length       : '?',
        players:   players.status   === 'fulfilled' ? players.value.data.players?.length       : '?',
        videos:    videos.status    === 'fulfilled' ? videos.value.data.total                  : '?',
        standings: standings.status === 'fulfilled' ? standings.value.data.standings?.length   : '?',
      });
    }).finally(() => setLoading(false));
  }, []);

  const quickLinks = [
    { icon: '📝', label: 'Create Article', desc: 'Publish a new news article',   to: '/admin/news' },
    { icon: '🎬', label: 'Manage Videos',  desc: 'Upload highlights & interviews', to: '/admin/videos' },
    { icon: '⚽', label: 'Manage Matches', desc: 'Add fixtures & results',        to: '/admin/matches' },
    { icon: '👤', label: 'Manage Squad',   desc: 'Add & edit player profiles',    to: '/admin/players' },
    { icon: '📊', label: 'Manage Standings', desc: 'Update the league table',     to: '/admin/standings' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="border-l-4 border-yellow-500 pl-6 mb-10">
        <p className="text-yellow-400 text-xs uppercase tracking-[0.3em] mb-2 font-semibold">CMS</p>
        <h1 className="section-title">Admin Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        <StatCard label="Articles"  value={loading ? '…' : stats.articles}  to="/admin/news"     color="claret" />
        <StatCard label="Matches"   value={loading ? '…' : stats.matches}   to="/admin/matches"  color="gold"   />
        <StatCard label="Players"   value={loading ? '…' : stats.players}   to="/admin/players"  color="green"  />
        <StatCard label="Videos"    value={loading ? '…' : stats.videos}    to="/admin/videos"   color="claret" />
        <StatCard label="Standings" value={loading ? '…' : stats.standings} to="/admin/standings" color="blue"  />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {quickLinks.map((item) => (
          <Link key={item.to} to={item.to}
            className="bg-dark-700 hover:bg-dark-600 border border-white/5 hover:border-claret-800/50 p-6 transition-all duration-200 group">
            <span className="text-3xl block mb-4">{item.icon}</span>
            <h3 className="font-display text-xl text-white uppercase tracking-wider
                           group-hover:text-yellow-400 transition-colors mb-1">
              {item.label}
            </h3>
            <p className="text-white/30 text-xs">{item.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default AdminDashboard;
