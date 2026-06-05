const TopBar = () => (
  <div className="bg-dark-800 border-b border-white/5 hidden md:block">
    <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
      <div className="flex items-center gap-6">
        <a href="#" target="_blank" rel="noreferrer"
          className="text-xs text-white/50 hover:text-yellow-400 uppercase tracking-widest transition-colors duration-200">
          Shop
        </a>
        <a href="#" target="_blank" rel="noreferrer"
          className="text-xs text-white/50 hover:text-yellow-400 uppercase tracking-widest transition-colors duration-200">
          Tickets
        </a>
        <a href="/hospitality"
          className="text-xs text-white/50 hover:text-yellow-400 uppercase tracking-widest transition-colors duration-200">
          Hospitality
        </a>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/30 uppercase tracking-widest">Kit Partner</span>
        <span className="text-xs font-bold text-white/60 tracking-widest uppercase">Castore</span>
      </div>
    </div>
  </div>
);

export default TopBar;
