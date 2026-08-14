import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/services');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-red-bg">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 w-full max-w-sm flex flex-col gap-3">
        <h1 className="text-xl font-medium text-dark-red mb-2">Log in to MotoFix</h1>
        {error && <p className="text-sm text-primary-red">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-primary-red rounded px-3 py-2 text-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border border-primary-red rounded px-3 py-2 text-sm"
          required
        />
        <button type="submit" className="bg-primary-red text-white py-2 rounded text-sm font-medium mt-2">
          Log in
        </button>
        <Link to="/register" className="text-xs text-dark-red text-center underline">
          Need an account? Register
        </Link>
      </form>
    </div>
  );
}
