import { Routes, Route } from 'react-router-dom';
import TopBar            from '../components/layout/TopBar';
import Navbar            from '../components/layout/Navbar';
import Footer            from '../components/layout/Footer';

import Home              from '../pages/Home';
import NewsPage          from '../pages/news/NewsPage';
import ArticlePage       from '../pages/news/ArticlePage';
import MatchesPage       from '../pages/matches/MatchesPage';
import SquadPage         from '../pages/squad/SquadPage';
import PlayerProfilePage from '../pages/squad/PlayerProfilePage';
// import ClaretsPlusPage   from '../pages/claretsplus/ClaretsPlusPage';
import LibhuraPlusPage   from '../pages/libhuraplus/LibhuraPlusPage';
import LoginPage         from '../pages/auth/LoginPage';
import AdminDashboard    from '../pages/admin/AdminDashboard';
import AdminNews         from '../pages/admin/AdminNews';
import { ProtectedRoute } from './ProtectedRoute';

const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <p className="font-display text-[8rem] text-claret-800 opacity-20 leading-none">404</p>
    <h1 className="font-display text-4xl text-white uppercase tracking-widest mb-4">Page Not Found</h1>
    <a href="/" className="btn-claret mt-4">Back to Home</a>
  </div>
);

const AppRouter = () => (
  <div className="min-h-screen flex flex-col bg-dark-900">
    <TopBar />
    <Navbar />
    <div className="flex-1">
      <Routes>
        {/* Public */}
        <Route path="/"             element={<Home />} />
        <Route path="/news"         element={<NewsPage />} />
        <Route path="/news/:slug"   element={<ArticlePage />} />
        <Route path="/matches"      element={<MatchesPage />} />
        <Route path="/table"        element={<MatchesPage />} />
        <Route path="/squad"        element={<SquadPage />} />
        <Route path="/player/:slug" element={<PlayerProfilePage />} />
        {/* <Route path="/claretsplus"  element={<ClaretsPlusPage />} /> */}
        <Route path="/libhuraplus"  element={<LibhuraPlusPage />} />
        <Route path="/login"        element={<LoginPage />} />

        {/* Admin — protected */}
        <Route path="/admin"      element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/news" element={<ProtectedRoute adminOnly><AdminNews /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
    <Footer />
  </div>
);

export default AppRouter;
