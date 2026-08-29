import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const OPTIONS = [
  {
    label: 'Customize My Vehicle',
    description: 'Pick your model and preview paint, rims, and body kit options in real time.',
    path: '/customize',
  },
  {
    label: 'My Garage',
    description: 'Revisit, edit, or share the custom builds you have saved.',
    path: '/garage',
  },
  {
    label: 'Find Parts',
    description: 'Browse the compatible parts catalog for your exact make and model.',
    path: '/parts',
  },
  {
    label: 'Request Roadside Assistance',
    description: 'Broken down? Describe the issue and share your location to get help.',
    path: '/roadside-request',
  },
];

export default function CustomerHome() {
  const { user } = useAuth();

  return (
    <div>
      <Navbar active="Home" />
      <div className="max-w-4xl mx-auto px-8 py-14">
        <h1 className="font-display font-semibold text-3xl text-dark-red">
          {user?.name ? `Welcome back, ${user.name.split(' ')[0]}` : 'Welcome back'}
        </h1>
        <p className="text-gray-500 mt-2">What would you like to do today?</p>

        <div className="grid sm:grid-cols-3 gap-5 mt-10">
          {OPTIONS.map((option) => (
            <Link
              key={option.path}
              to={option.path}
              className="border border-primary-red/30 hover:border-primary-red bg-light-red-bg rounded-xl p-6 flex flex-col gap-3 transition-colors"
            >
              <p className="font-display font-semibold text-lg text-dark-red">{option.label}</p>
              <p className="text-sm text-gray-500 flex-1">{option.description}</p>
              <span className="text-primary-red text-sm font-medium">Go &rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}