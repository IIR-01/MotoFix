export default function ServiceCard({ service, onEdit, onDelete }) {
  return (
    <div className="bg-light-red-bg border border-primary-red/30 rounded-xl px-6 py-5 flex items-center justify-between gap-4 hover:border-primary-red transition-colors">
      <div>
        <p className="font-semibold text-dark-red text-base">{service.serviceName}</p>
        <p className="text-sm text-gray-500 mt-1">{service.description}</p>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className="font-display font-semibold text-primary-red text-lg">{`\u09F3${service.basePrice}`}</span>
        <button
          onClick={() => onEdit(service)}
          className="bg-primary-red text-white text-sm font-medium px-4 py-2 rounded-md"
        >
          Edit
        </button>
        <button onClick={() => onDelete(service._id)} className="text-dark-red text-sm underline">
          Delete
        </button>
      </div>
    </div>
  );
}