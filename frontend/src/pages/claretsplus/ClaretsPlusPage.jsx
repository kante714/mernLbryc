import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { TabFilter, Spinner, ErrorMessage, EmptyState, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { timeAgo } from '../../utils/formatDate';

const CATEGORY_TABS = [
  { value: '', label: 'All' },
  { value: 'highlights', label: 'Highlights' },
  { value: 'interviews', label: 'Interviews' },
  { value: 'training', label: 'Training' },
  { value: 'academy-women', label: 'Academy & Women' },
];

const PlayIcon = () => (
  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center
                  group-hover:bg-claret-800 transition-all duration-300 border-2 border-white/40">
    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  </div>
);

const VideoCard = ({ video, canWatch }) => (
  <div className="group bg-dark-700 card-hover overflow-hidden relative">
    <div className="relative aspect-video overflow-hidden">
      <img src={video.thumbnail || 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600'}
        alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-dark-900/40 group-hover:bg-dark-900/20 transition-all" />

      {/* Lock overlay if premium and not subscribed */}
      {video.premium && !canWatch && (
        <div className="absolute inset-0 bg-dark-900/70 flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
            <span className="text-white/60 text-lg">🔒</span>
          </div>
          <span className="text-white/50 text-xs uppercase tracking-widest">Clarets+ Exclusive</span>
        </div>
      )}
      {(!video.premium || canWatch) && (
        <div className="absolute inset-0 flex items-center justify-center"><PlayIcon /></div>
      )}
      {video.premium && (
        <div className="absolute top-3 right-3 bg-yellow-500 text-dark-900 text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
          Clarets+
        </div>
      )}
      <div className="absolute bottom-2 right-3 text-white/70 text-xs font-mono bg-dark-900/70 px-1.5 py-0.5">
        {video.duration}
      </div>
    </div>
    <div className="p-4">
      <span className="text-claret-400 text-[10px] uppercase tracking-widest font-semibold">{video.category}</span>
      <h4 className="text-white font-semibold text-sm uppercase tracking-wide leading-snug mt-1.5 mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
        {video.title}
      </h4>
      <p className="text-white/30 text-xs uppercase tracking-widest">{timeAgo(video.publishedAt)}</p>
    </div>
  </div>
);

const SubscriptionCTA = () => (
  <div className="bg-claret-gradient p-10 md:p-16 text-center my-12">
    <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-6">
      <span className="text-yellow-400 text-2xl">▶</span>
    </div>
    <p className="text-yellow-400 text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Exclusive Access</p>
    <h2 className="font-display text-4xl md:text-5xl text-white uppercase tracking-wider mb-4">
      Subscribe to Clarets+
    </h2>
    <p className="text-white/60 text-sm leading-relaxed max-w-lg mx-auto mb-8">
      Get unlimited access to match highlights, exclusive interviews, behind-the-scenes training footage, and academy content.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link to="/login" className="bg-yellow-500 hover:bg-yellow-400 text-dark-900 font-bold px-10 py-4 uppercase tracking-widest text-sm transition-all duration-200 inline-block">
        Subscribe Now
      </Link>
      <Link to="/login" className="btn-outline px-10 py-4 text-sm">
        Sign In
      </Link>
    </div>
  </div>
);

const ClaretsPlusPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isSubscriber } = useAuth();

  useEffect(() => {
    setLoading(true);
    if (category) setSearchParams({ category }); else setSearchParams({});
    api.get('/videos', { params: { category: category || undefined } })
      .then(({ data }) => { setVideos(data.videos); setError(null); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div className="border-l-4 border-claret-800 pl-6">
          <p className="text-yellow-400 text-xs uppercase tracking-[0.3em] mb-2 font-semibold">Exclusive Content</p>
          <h1 className="section-title">Clarets<span className="text-claret-400">+</span></h1>
        </div>
        {!isSubscriber && (
          <Link to="/login" className="btn-claret hidden md:inline-block text-xs">Subscribe</Link>
        )}
      </div>

      {!isSubscriber && <SubscriptionCTA />}

      {/* Filter */}
      <TabFilter tabs={CATEGORY_TABS} active={category} onChange={setCategory} className="mb-8" />

      {loading && <Spinner />}
      {error && <ErrorMessage />}
      {!loading && !error && videos.length === 0 && <EmptyState message="No videos found." />}

      {!loading && !error && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((v) => (
            <VideoCard key={v._id} video={v} canWatch={isSubscriber || !v.premium} />
          ))}
        </div>
      )}
    </main>
  );
};

export default ClaretsPlusPage;
