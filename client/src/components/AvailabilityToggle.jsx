const STATUSES = ['Available', 'Busy', 'Offline'];

export default function AvailabilityToggle({ current, onChange }) {
  return (
    <div className="flex gap-2">
      {STATUSES.map((status) => (
        <button
          key={status}
          onClick={() => onChange(status)}
          className={
            current === status
              ? 'bg-primary-red text-white px-5 py-2.5 rounded-full text-sm font-medium'
              : 'bg-light-red-bg text-dark-red border border-primary-red px-5 py-2.5 rounded-full text-sm font-medium'
          }
        >
          {status === 'Available' ? `\u25CF ${status}` : status}
        </button>
      ))}
    </div>
  );
}