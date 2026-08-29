import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiFetch } from '../api/client';

export default function MyGarage() {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    apiFetch('/builds/mine')
      .then(setBuilds)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this build? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await apiFetch(`/builds/${id}`, { method: 'DELETE' });
      setBuilds((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = async (build) => {
    await navigator.clipboard.writeText(`${window.location.origin}/shared/${build.shareToken}`);
    setCopiedId(build._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <Navbar active="My Garage" />
      <div className="max-w-5xl mx-auto px-8 py-10">
        <h1 className="font-display font-semibold text-3xl text-dark-red">My Garage</h1>
        <p className="text-gray-500 mt-2">Your saved custom builds — revisit, edit, or share them anytime.</p>

        {error && (
          <p className="text-sm text-primary-red bg-light-red-bg border border-primary-red/30 rounded-md px-4 py-3 my-5">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-gray-400 mt-8">Loading…</p>
        ) : builds.length === 0 ? (
          <div className="border border-dashed border-primary-red/30 rounded-xl px-6 py-12 text-center mt-8">
            <p className="font-medium text-dark-red">No saved builds yet</p>
            <p className="text-sm text-gray-500 mt-1 mb-4">Customize a vehicle and save it to see it here.</p>
            <Link
              to="/customize"
              className="inline-block bg-primary-red hover:bg-dark-red transition-colors text-white px-5 py-2.5 rounded-md text-sm font-medium"
            >
              Start Customizing
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {builds.map((build) => {
              const params = new URLSearchParams({
                make: build.vehicle.make,
                model: build.vehicle.model,
                year: build.vehicle.year,
                buildId: build._id,
              }).toString();
              return (
                <div key={build._id} className="border border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col">
                  <div className="h-40 bg-gray-50 flex items-center justify-center">
                    <img
                      src={build.previewImageUrl || build.vehicle.baseImageUrl}
                      alt={build.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <p className="font-medium text-gray-900 truncate">{build.name}</p>
                    <p className="text-xs text-gray-400">
                      {build.vehicle.make} {build.vehicle.model} &middot; {build.vehicle.year}
                    </p>
                    <div className="mt-auto pt-3 flex items-center justify-between text-sm">
                      <Link to={`/customize/build?${params}`} className="text-primary-red hover:text-dark-red font-medium">
                        Edit
                      </Link>
                      <button type="button" onClick={() => handleCopy(build)} className="text-gray-500 hover:text-primary-red">
                        {copiedId === build._id ? 'Copied!' : 'Share'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(build._id)}
                        disabled={deletingId === build._id}
                        className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                      >
                        {deletingId === build._id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
