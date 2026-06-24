import { Link } from 'react-router-dom';

const SOCIAL = [
  { name: 'Facebook', href: 'https://www.facebook.com', icon: 'f' },
  { name: 'Twitter/X', href: 'https://twitter.com', icon: '𝕏' },
  { name: 'Instagram', href: 'https://www.instagram.com', icon: '◉' },
  { name: 'YouTube', href: 'https://www.youtube.com/@Deepaka4able', icon: '▶' },
  { name: 'TikTok', href: 'https://www.tiktok.com', icon: '♪' },
];

const FOOTER_COLS = [
  {
    title: 'Latest',
    links: [
      { label: 'Club News', to: '/news?category=club-news' },
      { label: 'Match Previews', to: '/news?category=match-previews' },
      { label: 'Match Reports', to: '/news?category=match-reports' },
      { label: 'Training', to: '/news?category=training' },
    ],
  },
  {
    title: 'Matches',
    links: [
      { label: 'Men', to: '/matches?team=men' },
      { label: 'Women', to: '/matches?team=women' },
      { label: 'Under 21', to: '/matches?team=under-21' },
      { label: 'Under 18', to: '/matches?team=under-18' },
    ],
  },
  {
    title: 'Squad',
    links: [
      { label: 'Men', to: '/squad?squad=men' },
      { label: 'Women', to: '/squad?squad=women' },
      { label: 'Under 21', to: '/squad?squad=under-21' },
      { label: 'E-Sports', to: '/squad?squad=e-sports' },
    ],
  },
  {
    title: 'Club',
    links: [
      { label: 'Libhura+', to: '/libhuraplus' },
      { label: 'Partners', to: '/partners' },
      { label: 'Fan Hub', to: '/fans' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
];

const Footer = () => (
  <footer className="bg-dark-800 border-t border-white/10 mt-20">
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
        {/* Brand col */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-claret-gradient rounded-full flex items-center justify-center">
              <span className="font-display text-white text-xl">LBRYC</span>
            </div>
          </div>
          <p className="text-white/40 text-sm leading-relaxed mb-6">
            The official home of Likhu Bhujee Ramechhap Youth Club. Est. 2063 BS.
          </p>
          <div className="flex gap-3">
            {SOCIAL.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-claret-800 flex items-center justify-center
                           text-white/50 hover:text-white transition-all duration-200 text-sm">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Nav cols */}
        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <h4 className="font-display text-white text-lg tracking-widest uppercase mb-5">{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-white/40 hover:text-yellow-400 text-sm uppercase tracking-wide transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/25 text-xs uppercase tracking-widest">
          © {new Date().getFullYear()} Likhu Bhujee Ramechhap Youth Club Ltd. All rights reserved.
        </p>
        <div className="flex gap-6">
          {['Terms of Use', 'Cookie Policy', 'Privacy Policy', 'Contact'].map((item) => (
            <a key={item} href="#"
              className="text-white/25 hover:text-white/60 text-xs uppercase tracking-widest transition-colors">
              {item}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
