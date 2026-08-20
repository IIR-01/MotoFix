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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    try {
      setServices(await apiFetch('/services/mine'));
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleAvailabilityChange = async (status) => {
    try {
      const updated = await apiFetch('/vendor/availability', {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      updateUser({ availabilityStatus: updated.availabilityStatus });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiFetch(`/services/${editingId}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await apiFetch('/services', { method: 'POST', body: JSON.stringify(form) });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      setError('');
      loadServices();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (service) => {
    setForm({ serviceName: service.serviceName, description: service.description, basePrice: service.basePrice });
    setEditingId(service._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await apiFetch(`/services/${id}`, { method: 'DELETE' });
      loadServices();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <Navbar active="My Services" />
      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="flex justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="font-display font-semibold text-3xl text-dark-red">Manage My Services</h1>
            <p className="text-gray-500 mt-2">
              Configure your available services, pricing, and live status.
            </p>
          </div>
          <AvailabilityToggle current={user?.availabilityStatus || 'Offline'} onChange={handleAvailabilityChange} />
        </div>

        {error && (
          <p className="text-sm text-primary-red bg-light-red-bg border border-primary-red/30 rounded-md px-4 py-3 mb-5">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-gray-400 mb-6">Loading…</p>
        ) : (
          <div className="flex flex-col gap-4 mb-6">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
            {services.length === 0 && (
              <div className="border border-dashed border-primary-red/30 rounded-xl px-6 py-10 text-center">
                <p className="font-medium text-dark-red">No services listed yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Add the roadside services you offer so customers can find and book you.
                </p>
              </div>
            )}
          </div>
        )}

        {showForm ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md bg-light-red-bg rounded-xl p-6">
            <p className="font-medium text-dark-red">{editingId ? 'Edit service' : 'New service'}</p>
            <input placeholder="Service name (e.g. Flat Tire Change)" value={form.serviceName}
              onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
              className="border border-gray-300 focus:border-primary-red focus:outline-none rounded-md px-4 py-3 text-base bg-white" required />
            <input placeholder="Description" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border border-gray-300 focus:border-primary-red focus:outline-none rounded-md px-4 py-3 text-base bg-white" />
            <input type="number" placeholder="Base price (Taka)" value={form.basePrice}
              onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
              className="border border-gray-300 focus:border-primary-red focus:outline-none rounded-md px-4 py-3 text-base bg-white" required />
            <div className="flex gap-4 items-center pt-1">
              <button type="submit" className="bg-primary-red hover:bg-dark-red transition-colors text-white px-5 py-2.5 rounded-md text-sm font-medium">
                {editingId ? 'Save changes' : 'Add service'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }}
                className="text-dark-red text-sm">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowForm(true)} className="bg-primary-red hover:bg-dark-red transition-colors text-white px-5 py-3 rounded-md text-sm font-medium">
            + Add New Service
          </button>
        )}
      </div>
    </div>
  );
}