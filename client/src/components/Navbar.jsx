import { useAuth } from '../context/AuthContext';

const LINKS_BY_ROLE = {
  vendor: [
    { label: 'Dashboard', path: '/' },
    { label: 'My Services', path: '/services' },
    { label: 'Requests', path: '/requests' },
  ],
  admin: [{ label: 'Pending Vendors', path: '/admin' }],
  customer: [{ label: 'Find Parts', path: '/parts' }],
};

export default function Navbar({ active }) {
  const { user } = useAuth();
  const links = LINKS_BY_ROLE[user?.role] || [];

  return (
    <nav className="bg-primary-red h-[70px] px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shrink-0">
          <span className="text-primary-red font-medium text-sm">M</span>
        </div>
        <span className="text-white font-medium text-lg">MotoFix</span>
      </div>
      <div className="flex gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.path}
            className={`px-4 py-2 rounded text-sm text-white border ${
              active === link.label ? 'bg-white/20 border-white' : 'border-white/50'
            }`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
