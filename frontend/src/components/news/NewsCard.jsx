import { Link } from 'react-router-dom';
import { timeAgo } from '../../utils/formatDate';
import { Badge } from '../ui';

const LABELS = {
  'club-news':     'Club News',
  'match-previews':'Match Preview',
  'match-reports': 'Match Report',
  'ticket-news':   'Tickets',
  'training':      'Training',
  'community':     'Community',
  'commercial':    'Commercial',
  'boardroom':     'Boardroom',
};

const FALLBACK = 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800';

// ── COMPACT (sidebar list card) ──────────────────────────────────
const CompactCard = ({ article }) => (
  <Link to={`/news/${article.slug}`}
    className="group flex gap-3 bg-dark-700 hover:bg-dark-600 transition-all duration-200 p-3 h-28 overflow-hidden">
    <div className="w-24 h-16 flex-shrink-0 overflow-hidden">
      <img src={article.imageUrl || FALLBACK} alt={article.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
    <div className="flex flex-col justify-between py-0.5 min-w-0">
      <Badge color="claret" className="self-start text-[10px] mb-1">
        {LABELS[article.category] || article.category}
      </Badge>
      <h4 className="font-semibold text-white text-xs leading-snug line-clamp-2
                     group-hover:text-yellow-400 transition-colors uppercase tracking-wide">
        {article.title}
      </h4>
      <p className="text-white/30 text-xs mt-1 uppercase tracking-widest">{timeAgo(article.publishedAt)}</p>
    </div>
  </Link>
);

// // ── FEATURED (full image card) ────────────────────────────────────
// const FeaturedCard = ({ article }) => (
//   <Link to={`/news/${article.slug}`}
//     className="group block relative overflow-hidden bg-dark-700 card-hover h-full">
//     <div className="relative h-64 overflow-hidden">
//       <img src={article.imageUrl || FALLBACK} alt={article.title}
//         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
//       <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent" />
//       <div className="absolute bottom-0 left-0 right-0 p-5">
//         <Badge color="claret" className="mb-2">{LABELS[article.category] || article.category}</Badge>
//         <h3 className="font-display text-xl text-white uppercase tracking-wide leading-tight
//                        group-hover:text-yellow-400 transition-colors">
//           {article.title}
//         </h3>
//         <p className="text-white/50 text-xs mt-1.5 uppercase tracking-widest">
//           {timeAgo(article.publishedAt)} · {article.readTime} min read
//         </p>
//       </div>
//     </div>
//   </Link>
// );

// // ── DEFAULT export — picks variant ───────────────────────────────
// const NewsCard = ({ article, variant = 'featured' }) => {
//   if (!article) return null;
//   if (variant === 'compact') return <CompactCard article={article} />;
//   return <FeaturedCard article={article} />;
// };

// ── FEATURED (full image card) ────────────────────────────────────
// fillHeight=true stretches the image to match a taller sibling grid cell
// (used only for the homepage hero card). Default keeps the original
// fixed h-64, used everywhere else this variant appears.
const FeaturedCard = ({ article, fillHeight = false }) => (
  <Link to={`/news/${article.slug}`}
    className={`group block relative overflow-hidden bg-dark-700 card-hover ${fillHeight ? 'h-[22.5rem]' : ''}`}>
     <div className={`relative overflow-hidden ${fillHeight ? 'h-full' : 'h-64'}`}>
      <img src={article.imageUrl || FALLBACK} alt={article.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <Badge color="claret" className="mb-2">{LABELS[article.category] || article.category}</Badge>
        <h3 className="font-display text-xl text-white uppercase tracking-wide leading-tight
                       group-hover:text-yellow-400 transition-colors">
          {article.title}
        </h3>
        <p className="text-white/50 text-xs mt-1.5 uppercase tracking-widest">
          {timeAgo(article.publishedAt)} · {article.readTime} min read
        </p>
      </div>
    </div>
  </Link>
);

// ── DEFAULT export — picks variant ───────────────────────────────
const NewsCard = ({ article, variant = 'featured', fillHeight = false }) => {
  if (!article) return null;
  if (variant === 'compact') return <CompactCard article={article} />;
  return <FeaturedCard article={article} fillHeight={fillHeight} />;
};

export default NewsCard;
