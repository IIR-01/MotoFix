import Navbar from './Navbar';

export default function ComingSoon({ active, title, description }) {
  return (
    <div>
      <Navbar active={active} />
      <div className="max-w-2xl mx-auto px-8 py-24 text-center">
        <div className="w-14 h-14 bg-light-red-bg rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 6v6l4 2" stroke="#D62839" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="9" stroke="#D62839" strokeWidth="2" />
          </svg>
        </div>
        <h1 className="font-display font-semibold text-2xl text-dark-red">{title}</h1>
        <p className="text-gray-500 mt-3 max-w-md mx-auto">{description}</p>
      </div>
    </div>
  );
}