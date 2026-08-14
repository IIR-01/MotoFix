import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    businessName: '', address: '', serviceCategory: 'mechanic_center', tradeLicense: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await register({ ...form, role });
      setMessage(res.message);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-red-bg py-10">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 w-full max-w-sm flex flex-col gap-3">
        <h1 className="text-xl font-medium text-dark-red mb-1">Create your account</h1>

        <div className="flex gap-2 mb-1">
          {['customer', 'vendor'].map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setRole(r)}
              className={
                role === r
                  ? 'flex-1 bg-primary-red text-white py-1.5 rounded text-xs capitalize'
                  : 'flex-1 bg-light-red-bg text-dark-red border border-primary-red py-1.5 rounded text-xs capitalize'
              }
            >
              {r}
            </button>
          ))}
        </div>

        {message && <p className="text-sm text-dark-red">{message}</p>}
        {error && <p className="text-sm text-primary-red">{error}</p>}

        <input placeholder="Full name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-primary-red rounded px-3 py-2 text-sm" required />
        <input type="email" placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-primary-red rounded px-3 py-2 text-sm" required />
        <input placeholder="Phone" value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border border-primary-red rounded px-3 py-2 text-sm" required />
        <input type="password" placeholder="Password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border border-primary-red rounded px-3 py-2 text-sm" required />

        {role === 'vendor' && (
          <>
            <input placeholder="Business name" value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className="border border-primary-red rounded px-3 py-2 text-sm" required />
            <input placeholder="Address" value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="border border-primary-red rounded px-3 py-2 text-sm" required />
            <select value={form.serviceCategory}
              onChange={(e) => setForm({ ...form, serviceCategory: e.target.value })}
              className="border border-primary-red rounded px-3 py-2 text-sm">
              <option value="mechanic_center">Mechanic service center</option>
              <option value="parts_store">Parts store</option>
            </select>
            <input placeholder="Trade license number" value={form.tradeLicense}
              onChange={(e) => setForm({ ...form, tradeLicense: e.target.value })}
              className="border border-primary-red rounded px-3 py-2 text-sm" required />
          </>
        )}

        <button type="submit" className="bg-primary-red text-white py-2 rounded text-sm font-medium mt-2">
          Register
        </button>
        <Link to="/login" className="text-xs text-dark-red text-center underline">
          Already have an account? Log in
        </Link>
      </form>
    </div>
  );
}
