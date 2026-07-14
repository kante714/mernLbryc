import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MegaMenu from './MegaMenu';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Latest',   path: '/news' },
  { label: 'Matches',  path: '/matches' },
  { label: 'Libhura+', path: '/libhuraplus' },
  { label: 'Squad',    path: '/squad' },
  { label: 'Fans',     path: '/fans' },
];

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate    = useNavigate();
  const navRef      = useRef(null);
  const timeoutRef  = useRef(null);

  // Close mega menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openMenu  = (item) => { clearTimeout(timeoutRef.current); setActiveMenu(item); };
  const closeMenu = ()     => { timeoutRef.current = setTimeout(() => setActiveMenu(null), 120); };
  const stayOpen  = ()     => clearTimeout(timeoutRef.current);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav ref={navRef} className="bg-dark-900 border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" onClick={() => setActiveMenu(null)}
            className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-claret-gradient rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {logoError ? (
                <span className="font-display text-white text-lg leading-none">lbryc</span>
              ) : (
                <img
                  src="/logo.jpg"
                  alt="Likhu Bhujee RYC"
                  className="w-full h-full object-contain"
                  onError={() => setLogoError(true)}
                />
              )}
            </div>
            <span className="font-display text-white text-2xl tracking-widest hidden sm:block">
              likhu bhujee
            </span>
          </Link>

          {/* Desktop nav items */}
          <div className="hidden md:flex items-center">
            {NAV_ITEMS.map(({ label }) => (
              <button
                key={label}
                onMouseEnter={() => openMenu(label)}
                onMouseLeave={closeMenu}
                className={`px-4 py-5 text-sm font-semibold uppercase tracking-widest transition-colors duration-200 border-b-2
                  ${activeMenu === label
                    ? 'text-yellow-400 border-yellow-400'
                    : 'text-white/70 hover:text-white border-transparent'}`}
              >
                {label}
              </button>
            ))}
            <Link to="/partners"
              className="px-4 py-5 text-sm font-semibold uppercase tracking-widest text-white/70 hover:text-white border-b-2 border-transparent transition-colors">
              Commercial
            </Link>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin"
                    className="text-xs text-yellow-400 uppercase tracking-widest hover:text-yellow-300 transition-colors">
                    Admin
                  </Link>
                )}
                <span className="text-xs text-white/40 uppercase tracking-wider">{user.name}</span>
                <button onClick={handleLogout}
                  className="text-xs border border-white/20 hover:border-claret-700 text-white/60 hover:text-white
                             px-3 py-1.5 uppercase tracking-widest transition-all duration-200">
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login"
                className="text-xs bg-claret-800 hover:bg-claret-700 text-white px-4 py-2
                           uppercase tracking-widest transition-all font-semibold">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile burger */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <div className="flex flex-col gap-1.5 w-6 h-5 justify-center">
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block h-0.5 w-6 bg-white transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mega menu — stays open while hovering nav item OR mega menu itself */}
      <div onMouseEnter={stayOpen} onMouseLeave={closeMenu}>
        {activeMenu && (
          <MegaMenu activeMenu={activeMenu} onClose={() => setActiveMenu(null)} />
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark-800 border-t border-white/10 px-4 py-6 space-y-1">
          {NAV_ITEMS.map(({ label, path }) => (
            <Link key={path} to={path}
              onClick={() => setMobileOpen(false)}
              className="block py-3 px-4 text-white/70 hover:text-white hover:bg-white/5
                         uppercase tracking-widest text-sm font-semibold transition-colors">
              {label}
            </Link>
          ))}
          <Link to="/partners" onClick={() => setMobileOpen(false)}
            className="block py-3 px-4 text-white/70 hover:text-white hover:bg-white/5
                       uppercase tracking-widest text-sm font-semibold transition-colors">
            Commercial
          </Link>
          <div className="border-t border-white/10 pt-4 mt-2 space-y-3">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)}
                    className="block py-3 px-4 text-center text-yellow-400 hover:text-yellow-300
                               uppercase tracking-widest text-sm font-semibold transition-colors border border-yellow-400/30">
                    Admin
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full btn-claret text-center">
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}
                className="btn-claret w-full text-center block">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;