import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticle, fetchArticles } from '../../api/newsApi';
import { formatDate } from '../../utils/formatDate';
import { Badge, Spinner, ErrorMessage } from '../../components/ui';
import NewsCard from '../../components/news/NewsCard';

const CATEGORY_LABELS = {
  'club-news': 'Club News', 'match-previews': 'Match Preview', 'match-reports': 'Match Report',
  'ticket-news': 'Tickets', 'training': 'Training', 'community': 'Community',
};

const ArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetchArticle(slug)
      .then(({ data }) => {
        setArticle(data.article);
        return fetchArticles({ category: data.article.category, limit: 3 });
      })
      .then(({ data }) => setRelated(data.articles.filter((a) => a.slug !== slug)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="py-32"><Spinner /></div>;
  if (error || !article) return <div className="py-32"><ErrorMessage message="Article not found." /></div>;

  return (
    <main>
      {/* Hero */}
      <div className="relative w-full h-[50vh] min-h-[360px] overflow-hidden">
        <img src={article.imageUrl || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600'}
          alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 pb-12">
          <Badge color="claret" className="mb-4">{CATEGORY_LABELS[article.category] || article.category}</Badge>
          <h1 className="font-display text-4xl md:text-6xl text-white uppercase tracking-wide leading-tight">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Meta */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-6 py-5 border-b border-white/10 text-xs text-white/40 uppercase tracking-widest">
          <span>{formatDate(article.publishedAt)}</span>
          <span>·</span>
          <span>{article.readTime} min read</span>
          <span>·</span>
          <span>{article.author}</span>
        </div>

        {/* Body */}
        <div className="py-10">
          {article.summary && (
            <p className="text-white/70 text-lg leading-relaxed border-l-2 border-claret-800 pl-5 mb-8 italic">
              {article.summary}
            </p>
          )}
          <div
            className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed
                       [&>p]:mb-5 [&>h2]:font-display [&>h2]:text-white [&>h2]:uppercase [&>h2]:tracking-wider [&>h2]:text-2xl [&>h2]:mt-10 [&>h2]:mb-4"
            dangerouslySetInnerHTML={{ __html: article.body || '<p>Full article content coming soon.</p>' }}
          />
        </div>

        {/* Back */}
        <div className="pb-8 border-t border-white/10 pt-8">
          <Link to="/news" className="btn-outline inline-block text-xs">← Back to News</Link>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-dark-800 border-t border-white/10 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-display text-3xl text-white uppercase tracking-widest mb-8">Related Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.slice(0, 3).map((a) => (
                <NewsCard key={a._id} article={a} variant="featured" />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default ArticlePage;
