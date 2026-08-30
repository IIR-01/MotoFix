import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function getLinks(user) {
  if (!user) return [];
  if (user.role === 'admin') return [{ label: 'Pending Vendors', path: '/admin' }];
  if (user.role === 'customer') {
    return [
      { label: 'Home', path: '/' },
      { label: 'Customize', path: '/customize' },
      { label: 'Find Parts', path: '/parts' },
      { label: 'Roadside Help', path: '/roadside-request' },
      { label: 'Cart', path: '/cart' },
      { label: 'My Orders', path: '/orders' },
    ];
  }
  if (user.role === 'vendor') {
    return user.serviceCategory === 'mechanic_center'
      ? [
          { label: 'Dashboard', path: '/' },
          { label: 'My Services', path: '/services' },
          { label: 'Requests', path: '/requests' },
        ]
      : [
          { label: 'Dashboard', path: '/' },
          { label: 'My Inventory', path: '/inventory' },
        ];
  }
  return [];
}

export default function Navbar({ active }) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const links = getLinks(user);

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
            className={`relative px-4 py-2 rounded text-sm border ${
              active === link.label
                ? 'bg-primary-red text-white border-primary-red'
                : 'text-dark-red border-primary-red/50'
            }`}
          >
            {link.label}
            {link.label === 'Cart' && itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-dark-red text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
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