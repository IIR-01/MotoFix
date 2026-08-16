import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS_BY_ROLE = {
  vendor: [
    { label: 'Dashboard', path: '/' },
    { label: 'My Services', path: '/services' },
    { label: 'Requests', path: '/requests' },
  ],
  admin: [{ label: 'Pending Vendors', path: '/admin' }],
  customer: [
    { label: 'Customize', path: '/customize' },
    { label: 'Find Parts', path: '/parts' },
  ],
};

export default function Navbar({ active }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = LINKS_BY_ROLE[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 h-[70px] px-6 flex items-center justify-between">
      <Link to="/" className="font-bold text-lg tracking-tight">
        <span className="text-black">MOTO</span>
        <span className="text-primary-red">FIX</span>
      </Link>
      <div className="flex items-center gap-2">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.path}
            className={`px-4 py-2 rounded text-sm border ${
              active === link.label
                ? 'bg-primary-red text-white border-primary-red'
                : 'text-dark-red border-primary-red/50'
            }`}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded text-sm text-dark-red border border-primary-red/50 ml-1"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}