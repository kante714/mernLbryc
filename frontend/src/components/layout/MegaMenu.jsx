import { Link } from 'react-router-dom';

const menuData = {
  Latest: {
    links: [
      { label: 'All News', to: '/news' },
      { label: 'Club News', to: '/news?category=club-news' },
      { label: 'Match Previews', to: '/news?category=match-previews' },
      { label: 'Match Reports', to: '/news?category=match-reports' },
      { label: 'Ticket News', to: '/news?category=ticket-news' },
      { label: 'Training', to: '/news?category=training' },
      { label: 'Community', to: '/news?category=community' },
    ],
  },
  Matches: {
    links: [
      { label: 'Up Next', to: '/matches' },
      { label: 'Men', to: '/matches?team=men' },
      { label: 'Women', to: '/matches?team=women' },
      { label: 'Under 21', to: '/matches?team=under-21' },
      { label: 'Under 18', to: '/matches?team=under-18' },
      { label: 'League Table', to: '/table' },
    ],
  },
  'Clarets+': {
    links: [
      { label: 'All Videos', to: '/claretsplus' },
      { label: 'Highlights', to: '/claretsplus?category=highlights' },
      { label: 'Interviews', to: '/claretsplus?category=interviews' },
      { label: 'Training', to: '/claretsplus?category=training' },
      { label: 'Academy & Women', to: '/claretsplus?category=academy-women' },
    ],
  },
  Squad: {
    links: [
      { label: 'Men', to: '/squad?squad=men' },
      { label: 'Women', to: '/squad?squad=women' },
      { label: 'Under 21', to: '/squad?squad=under-21' },
      { label: 'Under 18', to: '/squad?squad=under-18' },
      { label: 'E-Sports', to: '/squad?squad=e-sports' },
    ],
  },
  Fans: {
    links: [
      { label: 'Fan Hub', to: '/fans' },
      { label: 'Libura+', to: '/liburaplus' },
      { label: 'Fan Advisory Board', to: '/fans/advisory-board' },
      { label: 'Travel', to: '/fans/travel' },
      { label: 'Disabled Supporter Info', to: '/fans/accessibility' },
    ],
  },
};

const MegaMenu = ({ activeMenu }) => {
  const data = menuData[activeMenu];
  if (!data) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-dark-800 border-t-2 border-claret-800 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {data.links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-white/60 hover:text-yellow-400 text-sm uppercase tracking-wider py-2 px-3
                         hover:bg-white/5 transition-all duration-150 font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
