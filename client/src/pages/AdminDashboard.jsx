import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { apiFetch } from '../api/client';

const CATEGORY_LABELS = {
  parts_store: 'Parts store',
  mechanic_center: 'Mechanic service center',
};

export default function AdminDashboard() {
  const [tab, setTab] = useState('pending'); // 'pending' | 'approved'
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [error, setError] = useState('');

  const load = async (which) => {
    setLoading(true);
    try {
      setVendors(await apiFetch(`/admin/vendors/${which}`));
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(tab);
  }, [tab]);

  const handleAction = async (id, action) => {
    setActioningId(id);
    try {
      await apiFetch(`/admin/vendors/${id}/${action}`, { method: 'PATCH' });
      setVendors((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div>
      <Navbar active="Pending Vendors" />
      <div className="max-w-4xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-medium text-dark-red">Vendor management</h1>
        <p className="text-sm text-gray-500 mt-1 mb-5">
          Review applications, and suspend approved vendors found in violation of platform policy.
        </p>

        <div className="flex gap-2 mb-5">
          {['pending', 'approved'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                tab === t
                  ? 'bg-primary-red text-white px-4 py-1.5 rounded-full text-sm font-medium capitalize'
                  : 'bg-light-red-bg text-dark-red border border-primary-red px-4 py-1.5 rounded-full text-sm capitalize'
              }
            >
              {t}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-primary-red mb-4">{error}</p>}

        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : vendors.length === 0 ? (
          <p className="text-sm text-gray-400">
            {tab === 'pending' ? 'No pending applications right now.' : 'No approved vendors yet.'}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {vendors.map((vendor) => (
              <div
                key={vendor._id}
                className="bg-light-red-bg border border-primary-red rounded-lg px-5 py-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium text-dark-red text-sm">{vendor.businessName}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {CATEGORY_LABELS[vendor.serviceCategory] || vendor.serviceCategory} · {vendor.address}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {vendor.name} · {vendor.email} · Trade license: {vendor.tradeLicense}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {tab === 'pending' ? (
                    <>
                      <button
                        disabled={actioningId === vendor._id}
                        onClick={() => handleAction(vendor._id, 'approve')}
                        className="bg-primary-red text-white text-xs px-4 py-2 rounded disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        disabled={actioningId === vendor._id}
                        onClick={() => handleAction(vendor._id, 'reject')}
                        className="text-dark-red text-xs px-4 py-2 border border-primary-red rounded disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      disabled={actioningId === vendor._id}
                      onClick={() => handleAction(vendor._id, 'suspend')}
                      className="text-dark-red text-xs px-4 py-2 border border-primary-red rounded disabled:opacity-50"
                    >
                      Suspend
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
