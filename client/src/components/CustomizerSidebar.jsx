import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STEPS = [
  {
    key: 'select-vehicle',
    label: 'Select Vehicle',
    description: 'Choose your make, model and year',
    path: '/customize',
  },
  {
    key: 'customize',
    label: 'Customize',
    description: 'Personalize your vehicle with available options',
  },
  {
    key: 'review',
    label: 'Review',
    description: 'Review your build and save or share',
  },
];

function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
    </svg>
  );
}

function LogoutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" />
      <path d="M15 16l4-4-4-4" />
      <path d="M19 12H9" />
    </svg>
  );
}

export default function CustomizerSidebar({ activeStep }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-gray-200 bg-white flex flex-col md:justify-between px-5 py-6">
      <div>
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-gray-600 mb-8 hover:text-primary-red transition-colors"
        >
          <HomeIcon className="w-5 h-5" />
          Home
        </Link>

        <ol>
          {STEPS.map((step, index) => {
            const isActive = step.key === activeStep;
            const isLast = index === STEPS.length - 1;
            const label = (
              <div className={(isLast ? '' : 'pb-8') + ' rounded-lg px-2 py-1.5 -mx-2 ' + (isActive ? 'bg-light-red-bg' : '')}>
                <p
                  className={
                    isActive
                      ? 'text-sm font-semibold text-primary-red'
                      : step.path
                        ? 'text-sm font-medium text-gray-700 group-hover:text-primary-red transition-colors'
                        : 'text-sm font-medium text-gray-400'
                  }
                >
                  {step.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
              </div>
            );

            return (
              <li key={step.key} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={
                      isActive
                        ? 'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 bg-primary-red text-white shadow-sm'
                        : 'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 bg-gray-200 text-gray-400'
                    }
                  >
                    {index + 1}
                  </span>
                  {!isLast && <span className="w-px flex-1 bg-gray-200 mt-1" />}
                </div>
                {step.path ? (
                  <Link to={step.path} className="group flex-1">
                    {label}
                  </Link>
                ) : (
                  <div className="flex-1 cursor-not-allowed">{label}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-red transition-colors mt-6 md:mt-0"
      >
        <LogoutIcon className="w-5 h-5" />
        Logout
      </button>
    </aside>
  );
}
