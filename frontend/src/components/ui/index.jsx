// Button
export const Button = ({ children, variant = 'claret', size = 'md', className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center font-semibold uppercase tracking-widest transition-all duration-200 cursor-pointer disabled:opacity-40';
  const variants = {
    claret: 'bg-claret-800 hover:bg-claret-700 text-white',
    outline: 'border border-white/30 hover:border-white text-white hover:bg-white/5',
    gold: 'bg-yellow-500 hover:bg-yellow-400 text-dark-900',
    ghost: 'text-white/60 hover:text-white hover:bg-white/5',
  };
  const sizes = { sm: 'px-4 py-1.5 text-xs', md: 'px-6 py-2.5 text-sm', lg: 'px-8 py-3.5 text-base' };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Badge
export const Badge = ({ children, color = 'claret', className = '' }) => {
  const colors = {
    claret: 'bg-claret-800/60 text-claret-200 border border-claret-700/40',
    gold: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
    green: 'bg-green-900/40 text-green-400 border border-green-700/30',
    white: 'bg-white/10 text-white/70 border border-white/10',
    live: 'bg-red-600 text-white animate-pulse',
  };
  return (
    <span className={`inline-block text-xs font-semibold uppercase tracking-widest px-2.5 py-1 ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

// SectionHeader
export const SectionHeader = ({ title, subtitle, action, actionTo }) => (
  <div className="flex items-end justify-between mb-8">
    <div>
      {subtitle && <p className="text-claret-400 text-xs uppercase tracking-widest mb-2 font-semibold">{subtitle}</p>}
      <h2 className="section-title">{title}</h2>
    </div>
    {action && actionTo && (
      <a href={actionTo}
        className="text-xs text-white/40 hover:text-yellow-400 uppercase tracking-widest transition-colors hidden md:block">
        {action} →
      </a>
    )}
  </div>
);

// TabFilter
export const TabFilter = ({ tabs, active, onChange, className = '' }) => (
  <div className={`flex gap-1 flex-wrap ${className}`}>
    {tabs.map((tab) => (
      <button
        key={tab.value}
        onClick={() => onChange(tab.value)}
        className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-200
          ${active === tab.value
            ? 'bg-claret-800 text-white'
            : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

// LoadMoreButton
export const LoadMoreButton = ({ onClick, loading, hasMore }) => {
  if (!hasMore) return null;
  return (
    <div className="flex justify-center mt-12">
      <button
        onClick={onClick}
        disabled={loading}
        className="btn-outline flex items-center gap-3 disabled:opacity-40"
      >
        {loading ? (
          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Loading...</>
        ) : 'Load More'}
      </button>
    </div>
  );
};

// Spinner
export const Spinner = ({ size = 'md' }) => {
  const s = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex justify-center items-center py-16">
      <div className={`${s[size]} border-2 border-white/10 border-t-claret-600 rounded-full animate-spin`} />
    </div>
  );
};

// ErrorMessage
export const ErrorMessage = ({ message = 'Something went wrong. Please try again.' }) => (
  <div className="flex flex-col items-center py-16 text-center">
    <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center mb-4">
      <span className="text-red-400 text-xl">!</span>
    </div>
    <p className="text-white/50 text-sm">{message}</p>
  </div>
);

// EmptyState
export const EmptyState = ({ message = 'No results found.' }) => (
  <div className="flex flex-col items-center py-16 text-center">
    <p className="text-white/30 text-sm uppercase tracking-widest">{message}</p>
  </div>
);
