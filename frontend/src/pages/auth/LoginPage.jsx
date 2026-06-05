import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-claret-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="font-display text-white text-2xl">BFC</span>
          </div>
          <h1 className="font-display text-3xl text-white uppercase tracking-widest">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h1>
          <p className="text-white/40 text-xs uppercase tracking-widest mt-2">
            {mode === 'login' ? 'Access your Clarets+ account' : 'Join the Clarets+ community'}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex mb-8 border border-white/10">
          {['login', 'register'].map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 py-3 text-xs font-semibold uppercase tracking-widest transition-all duration-200
                ${mode === m ? 'bg-claret-800 text-white' : 'text-white/40 hover:text-white'}`}>
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Full Name</label>
              <input
                type="text" placeholder="Your Name" required
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-dark-700 border border-white/10 focus:border-claret-700 text-white px-4 py-3
                           text-sm outline-none transition-colors placeholder:text-white/20"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Email Address</label>
            <input
              type="email" placeholder="you@example.com" required
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-dark-700 border border-white/10 focus:border-claret-700 text-white px-4 py-3
                         text-sm outline-none transition-colors placeholder:text-white/20"
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password" placeholder="••••••••" required minLength={6}
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-dark-700 border border-white/10 focus:border-claret-700 text-white px-4 py-3
                         text-sm outline-none transition-colors placeholder:text-white/20"
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700/40 px-4 py-3">
              <p className="text-red-400 text-xs uppercase tracking-widest">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full btn-claret py-4 text-sm flex items-center justify-center gap-3 mt-2">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Please wait...</>
              : mode === 'login' ? 'Sign In' : 'Create Account'
            }
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/" className="text-white/30 text-xs uppercase tracking-widest hover:text-white/60 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
