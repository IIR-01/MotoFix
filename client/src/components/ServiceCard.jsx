export default function ServiceCard({ service, onEdit, onDelete }) {
  return (
    <div className="bg-light-red-bg border border-primary-red rounded-lg px-5 py-3 flex items-center justify-between">
      <div>
        <p className="font-medium text-dark-red text-sm">{service.serviceName}</p>
        <p className="text-xs text-gray-500 mt-1">{service.description}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-medium text-primary-red text-sm">{`\u09F3${service.basePrice}`}</span>
        <button
          onClick={() => onEdit(service)}
          className="bg-primary-red text-white text-xs px-3 py-1.5 rounded"
        >
          Edit
        </button>
        <button onClick={() => onDelete(service._id)} className="text-dark-red text-xs underline">
          Delete
        </button>
      </div>
    </div>
  );
}
