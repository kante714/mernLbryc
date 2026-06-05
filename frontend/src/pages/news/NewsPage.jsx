import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchArticles } from '../../api/newsApi';
import NewsCard from '../../components/news/NewsCard';
import NewsCategoryFilter from '../../components/news/NewsCategoryFilter';
import { Spinner, ErrorMessage, LoadMoreButton, EmptyState } from '../../components/ui';

const LIMIT = 12;

const NewsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const loadArticles = useCallback(async (cat, pg, append = false) => {
    try {
      append ? setLoadingMore(true) : setLoading(true);
      const { data } = await fetchArticles({ category: cat || undefined, page: pg, limit: LIMIT });
      setArticles((prev) => append ? [...prev, ...data.articles] : data.articles);
      setHasMore(pg < data.pages);
      setError(null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    loadArticles(category, 1, false);
    if (category) setSearchParams({ category });
    else setSearchParams({});
  }, [category]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    loadArticles(category, next, true);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="border-l-4 border-claret-800 pl-6 mb-10">
        <p className="text-claret-400 text-xs uppercase tracking-[0.3em] mb-2 font-semibold">Burnley FC</p>
        <h1 className="section-title">Latest News</h1>
      </div>

      {/* Filter */}
      <div className="mb-8">
        <NewsCategoryFilter active={category} onChange={setCategory} />
      </div>

      {/* Content */}
      {loading && <Spinner />}
      {error && <ErrorMessage />}

      {!loading && !error && articles.length === 0 && <EmptyState message="No articles found in this category." />}

      {!loading && !error && articles.length > 0 && (
        <>
          {/* Featured first article */}
          <div className="mb-4">
            <NewsCard article={articles[0]} variant="featured" />
          </div>

          {/* Grid of remaining */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {articles.slice(1).map((a) => (
              <NewsCard key={a._id} article={a} variant="featured" />
            ))}
          </div>

          <LoadMoreButton onClick={handleLoadMore} loading={loadingMore} hasMore={hasMore} />
        </>
      )}
    </main>
  );
};

export default NewsPage;
