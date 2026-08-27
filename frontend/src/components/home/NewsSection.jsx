import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchArticles } from '../../api/newsApi';
import NewsCard from '../news/NewsCard';
import { Spinner, ErrorMessage, SectionHeader } from '../ui';

const NewsSection = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles({ limit: 7 })
      .then(({ data }) => setArticles(data.articles))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <SectionHeader
        title="Latest News"
        subtitle="Libhura Updates"
        action="All News"
        actionTo="/news"
      />

      {loading && <Spinner />}
      {error && <ErrorMessage />}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Featured large card */}
          <div className="lg:col-span-2">
            {articles[0] && <NewsCard article={articles[0]} variant="featured" fillHeight/>}
          </div>

          {/* Side cards */}
          <div className="flex flex-col gap-3">
            {articles.slice(1, 4).map((a) => (
              <NewsCard key={a._id} article={a} variant="compact" />
            ))}
          </div>

          {/* Bottom row */}
          {articles.slice(4, 7).map((a) => (
            <div key={a._id} className="hidden lg:block">
              <NewsCard article={a} variant="featured" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center md:hidden">
        <Link to="/news" className="btn-outline inline-block">All News</Link>
      </div>
    </section>
  );
};

export default NewsSection;
