import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ServiceCard from '../components/ServiceCard';
import AvailabilityToggle from '../components/AvailabilityToggle';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = { serviceName: '', description: '', basePrice: '' };

export default function ManageServices() {
  const { user, updateUser } = useAuth();
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const loadServices = async () => setServices(await apiFetch('/services/mine'));

  useEffect(() => {
    loadServices();
  }, []);

  const handleAvailabilityChange = async (status) => {
    const updated = await apiFetch('/vendor/availability', {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    updateUser({ availabilityStatus: updated.availabilityStatus });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await apiFetch(`/services/${editingId}`, { method: 'PUT', body: JSON.stringify(form) });
    } else {
      await apiFetch('/services', { method: 'POST', body: JSON.stringify(form) });
    }
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    loadServices();
  };

  const handleEdit = (service) => {
    setForm({ serviceName: service.serviceName, description: service.description, basePrice: service.basePrice });
    setEditingId(service._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await apiFetch(`/services/${id}`, { method: 'DELETE' });
    loadServices();
  };

  return (
    <div>
      <Navbar active="My Services" />
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex justify-between items-start mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-medium text-dark-red">Manage my services</h1>
            <p className="text-sm text-gray-500 mt-1">
              Set your available roadside services, pricing, and live status.
            </p>
          </div>
          <AvailabilityToggle current={user?.availabilityStatus || 'Offline'} onChange={handleAvailabilityChange} />
        </div>

        <div className="flex flex-col gap-3 mb-4">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
          {services.length === 0 && (
            <p className="text-sm text-gray-400">No services listed yet. Add your first one below.</p>
          )}
        </div>

        {showForm ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
            <input placeholder="Service name (e.g. Flat Tire Change)" value={form.serviceName}
              onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
              className="border border-primary-red rounded px-3 py-2 text-sm" required />
            <input placeholder="Description" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border border-primary-red rounded px-3 py-2 text-sm" />
            <input type="number" placeholder="Base price (Taka)" value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
              className="border border-primary-red rounded px-3 py-2 text-sm" required />
            <div className="flex gap-3 items-center">
              <button type="submit" className="bg-primary-red text-white px-5 py-2 rounded text-sm font-medium">
                {editingId ? 'Save changes' : 'Add service'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }}
                className="text-dark-red text-sm underline">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowForm(true)} className="bg-primary-red text-white px-5 py-2.5 rounded text-sm font-medium">
            + Add new service
          </button>
        )}
      </div>
    </div>
  );
}
