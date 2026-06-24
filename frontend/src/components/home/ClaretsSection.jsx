import { Link } from 'react-router-dom';
import { SectionHeader } from '../ui';

const PREVIEW_VIDEOS = [
  { id: 1, title: 'HIGHLIGHTS: LBRYC 0-0 Bhamti Bandhar', category: 'highlights', thumbnail: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600', duration: '5:14', premium: true },
  { id: 2, title: 'ABIRAJ: Post-Match Reaction vs Bhamti Bandhar', category: 'interviews', thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600', duration: '3:42', premium: true },
  { id: 3, title: 'TRAINING: Libhura Prepare for Milan Chowk', category: 'training', thumbnail: 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?w=600', duration: '4:07', premium: true },
  { id: 4, title: 'WOMEN: Match Highlights vs We ARE Brothers', category: 'academy-women', thumbnail: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600', duration: '6:22', premium: false },
];

const PlayIcon = () => (
  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center
                  group-hover:bg-claret-800 transition-all duration-300 border border-white/30">
    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  </div>
);

const VideoCard = ({ video }) => (
  <Link to="/libhuraplus" className="group relative overflow-hidden block bg-dark-700 card-hover">
    <div className="relative aspect-video overflow-hidden">
      <img src={video.thumbnail} alt={video.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-dark-900/40 group-hover:bg-dark-900/20 transition-all duration-300" />
      <div className="absolute inset-0 flex items-center justify-center">
        <PlayIcon />
      </div>
      {video.premium && (
        <div className="absolute top-3 right-3 bg-yellow-500 text-dark-900 text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
          Libhura+
        </div>
      )}
      <div className="absolute bottom-2 right-3 text-white/70 text-xs font-mono">{video.duration}</div>
    </div>
    <div className="p-4">
      <span className="text-claret-400 text-[10px] uppercase tracking-widest font-semibold">{video.category}</span>
      <h4 className="text-white font-semibold text-sm uppercase tracking-wide leading-snug mt-1 group-hover:text-yellow-400 transition-colors line-clamp-2">
        {video.title}
      </h4>
    </div>
  </Link>
);

const ClaretsSection = () => (
  <section className="bg-dark-800 py-16 border-y border-white/5">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-yellow-400 text-xs uppercase tracking-[0.3em] mb-2 font-semibold">Exclusive Content</p>
          <h2 className="section-title">Libhura<span className="text-claret-400">+</span></h2>
        </div>
        <Link to="/libhuraplus"
          className="hidden md:inline-flex items-center gap-2 text-xs text-white/40 hover:text-yellow-400 uppercase tracking-widest transition-colors">
          All Videos →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PREVIEW_VIDEOS.map((v) => <VideoCard key={v.id} video={v} />)}
      </div>

      {/* CTA */}
      <div className="mt-10 bg-claret-gradient rounded-none p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-3xl md:text-4xl text-white uppercase tracking-wider mb-2">
            Unlock All Content
          </h3>
          <p className="text-white/60 text-sm">
            Subscribe to Libhura+ for exclusive interviews, full-match replays, behind-the-scenes access and more.
          </p>
        </div>
        <Link to="/login" className="flex-shrink-0 bg-yellow-500 hover:bg-yellow-400 text-dark-900 font-bold px-8 py-3.5 uppercase tracking-widest text-sm transition-all duration-200">
          Subscribe Now
        </Link>
      </div>
    </div>
  </section>
);

export default ClaretsSection;
