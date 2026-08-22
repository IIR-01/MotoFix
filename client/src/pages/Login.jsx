import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoutePanel from '../components/RoutePanel';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'vendor') {
        navigate(user.serviceCategory === 'mechanic_center' ? '/services' : '/inventory');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        // Customers land on "/", which renders the chooser (CustomerHome)
        // rather than jumping straight into one specific feature.
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      <RoutePanel />

      <div className="flex-1 flex items-center justify-center px-6 py-16 bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-5">
          <div className="mb-2">
            <h1 className="font-display font-semibold text-3xl text-ink">Welcome back</h1>
            <p className="text-gray-500 mt-2">Log in to manage your services and requests.</p>
          </div>

          {error && (
            <p className="text-sm text-primary-red bg-light-red-bg border border-primary-red/30 rounded-md px-4 py-3">
              {error}
            </p>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink">Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border border-gray-300 focus:border-primary-red focus:outline-none rounded-md px-4 py-3 text-base"
              required
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink">Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border border-gray-300 focus:border-primary-red focus:outline-none rounded-md px-4 py-3 text-base"
              required
            />
          </label>

          <button
            type="submit"
            className="bg-primary-red hover:bg-dark-red transition-colors text-white py-3.5 rounded-md text-base font-medium mt-2"
          >
            Log in
          </button>

          <p className="text-sm text-gray-500 text-center mt-2">
            Need an account?{' '}
            <Link to="/register" className="text-primary-red font-medium">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}