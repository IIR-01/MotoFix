import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoutePanel from '../components/RoutePanel';

const inputClass =
  'border border-gray-300 focus:border-primary-red focus:outline-none rounded-md px-4 py-3 text-base';
const labelClass = 'flex flex-col gap-1.5';

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
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');

  const captureLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
      () => setLocationError('Could not get your location. Please allow location access and try again.')
    );
  };

  const needsLocation = role === 'vendor' && form.serviceCategory === 'mechanic_center';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (needsLocation && !location) {
      setError('Share your shop location before registering — customers need it to find you.');
      return;
    }
    try {
      const res = await register({ ...form, role, ...(needsLocation && { location }) });
      setMessage(res.message);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      <RoutePanel />

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-5 my-auto">
          <div className="mb-1">
            <h1 className="font-display font-semibold text-3xl text-ink">Create your account</h1>
            <p className="text-gray-500 mt-2">Join as a customer, or register your business.</p>
          </div>

          <div className="flex gap-2 p-1 bg-light-red-bg rounded-lg">
            {['customer', 'vendor'].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={
                  role === r
                    ? 'flex-1 bg-primary-red text-white py-2.5 rounded-md text-sm font-medium capitalize'
                    : 'flex-1 text-dark-red py-2.5 rounded-md text-sm font-medium capitalize'
                }
              >
                {r}
              </button>
            ))}
          </div>

          {message && (
            <p className="text-sm text-dark-red bg-light-red-bg border border-primary-red/30 rounded-md px-4 py-3">
              {message}
            </p>
          )}
          {error && (
            <p className="text-sm text-primary-red bg-light-red-bg border border-primary-red/30 rounded-md px-4 py-3">
              {error}
            </p>
          )}

          <label className={labelClass}>
            <span className="text-sm font-medium text-ink">Full name</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass} required />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className={labelClass}>
              <span className="text-sm font-medium text-ink">Email</span>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass} required />
            </label>
            <label className={labelClass}>
              <span className="text-sm font-medium text-ink">Phone</span>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass} required />
            </label>
          </div>

          <label className={labelClass}>
            <span className="text-sm font-medium text-ink">Password</span>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass} required />
          </label>

          {role === 'vendor' && (
            <div className="flex flex-col gap-5 pt-5 border-t border-gray-100">
              <p className="text-sm font-medium text-dark-red -mb-1">Business details</p>
              <label className={labelClass}>
                <span className="text-sm font-medium text-ink">Business name</span>
                <input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className={inputClass} required />
              </label>
              <label className={labelClass}>
                <span className="text-sm font-medium text-ink">Address</span>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className={inputClass} required />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={labelClass}>
                  <span className="text-sm font-medium text-ink">Category</span>
                  <select value={form.serviceCategory} onChange={(e) => setForm({ ...form, serviceCategory: e.target.value })}
                    className={inputClass}>
                    <option value="mechanic_center">Mechanic center</option>
                    <option value="parts_store">Parts store</option>
                  </select>
                </label>
                <label className={labelClass}>
                  <span className="text-sm font-medium text-ink">Trade license</span>
                  <input value={form.tradeLicense} onChange={(e) => setForm({ ...form, tradeLicense: e.target.value })}
                    className={inputClass} required />
                </label>
              </div>

              {needsLocation && (
                <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center gap-2 text-center">
                  <span className="w-3 h-3 bg-primary-red rounded-full" />
                  {location ? (
                    <p className="text-sm font-medium text-dark-red">
                      Shop location shared — {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-500">
                        Customers find nearby mechanics by shop location — share yours to appear in search.
                      </p>
                      <button type="button" onClick={captureLocation} className="text-sm text-primary-red font-medium underline">
                        Share my location
                      </button>
                    </>
                  )}
                  {locationError && <p className="text-sm text-primary-red">{locationError}</p>}
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="bg-primary-red hover:bg-dark-red transition-colors text-white py-3.5 rounded-md text-base font-medium mt-2"
          >
            Create account
          </button>

          <p className="text-sm text-gray-500 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-red font-medium">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}