const AppDownloadCTA = () => (
  <section className="bg-dark-800 border-y border-white/5 py-16">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="text-center md:text-left">
          <p className="text-claret-400 text-xs uppercase tracking-[0.3em] mb-3 font-semibold">Official App</p>
          <h2 className="font-display text-4xl md:text-5xl text-white uppercase tracking-wider mb-4">
            LBRYC<br /><span className="text-yellow-400">In Your Pocket</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-md">
            Live scores, news, match alerts, and Libhura+ content — all in the official LBRYC app.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <a href="https://apps.apple.com" target="_blank" rel="noreferrer"
            className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10
                       hover:border-claret-700 px-6 py-4 transition-all duration-200 min-w-[180px]">
            <svg className="w-8 h-8 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Download on the</p>
              <p className="text-white font-semibold text-sm uppercase tracking-wide">App Store</p>
            </div>
          </a>

          <a href="https://play.google.com" target="_blank" rel="noreferrer"
            className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10
                       hover:border-claret-700 px-6 py-4 transition-all duration-200 min-w-[180px]">
            <svg className="w-8 h-8 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l15 8.5-15 8.5c-.5.33-1.5.33-1.5-.5z"/>
            </svg>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Get it on</p>
              <p className="text-white font-semibold text-sm uppercase tracking-wide">Google Play</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default AppDownloadCTA;
