import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { apiFetch } from '../api/client';

const STATUS_STYLE = {
  Pending: 'bg-light-red-bg text-dark-red border-primary-red/30',
  Accepted: 'bg-white text-dark-red border-primary-red/30',
  'En Route': 'bg-white text-dark-red border-primary-red/30',
  Completed: 'bg-gray-50 text-gray-500 border-gray-200',
  Cancelled: 'bg-gray-50 text-gray-400 border-gray-200',
};

export default function VendorRequestDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState(null);

  const load = async () => {
    try {
      setRequests(await apiFetch('/vendor/requests'));
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const respond = async (id, decision) => {
    setActioningId(id);
    setError('');
    try {
      await apiFetch(`/vendor/requests/${id}/respond`, { method: 'PATCH', body: JSON.stringify({ decision }) });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setActioningId(null);
    }
  };

  const advance = async (id, status) => {
    setActioningId(id);
    setError('');
    try {
      await apiFetch(`/vendor/requests/${id}/advance`, { method: 'PATCH', body: JSON.stringify({ status }) });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div>
      <Navbar active="Requests" />
      <div className="max-w-3xl mx-auto px-8 py-10">
        <h1 className="font-display font-semibold text-3xl text-dark-red">Incoming Requests</h1>
        <p className="text-gray-500 mt-2">Accept or reject requests sent to you, and update status as you go.</p>

        {error && (
          <p className="text-sm text-primary-red bg-light-red-bg border border-primary-red/30 rounded-md px-4 py-3 mt-5">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-gray-400 mt-6">Loading&hellip;</p>
        ) : requests.length === 0 ? (
          <div className="border border-dashed border-primary-red/30 rounded-xl px-6 py-10 text-center mt-6">
            <p className="font-medium text-dark-red">No requests yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Make sure your availability is set to Available on My Services so customers can find you.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-6">
            {requests.map((r) => (
              <div key={r._id} className={`border rounded-xl px-5 py-4 ${STATUS_STYLE[r.status]}`}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{r.issueCategory}</p>
                    <p className="text-sm opacity-70 mt-0.5">{r.customer?.name} &middot; {r.customer?.phone}</p>
                    <p className="text-xs opacity-60 mt-0.5">{new Date(r.createdAt).toLocaleString()}</p>
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full border bg-white shrink-0">{r.status}</span>
                </div>

                {r.status === 'Pending' && (
                  <div className="flex gap-2 mt-3">
                    <button disabled={actioningId === r._id} onClick={() => respond(r._id, 'accept')}
                      className="bg-primary-red text-white text-sm font-medium px-4 py-2 rounded-md disabled:opacity-50">
                      Accept
                    </button>
                    <button disabled={actioningId === r._id} onClick={() => respond(r._id, 'reject')}
                      className="text-dark-red text-sm px-4 py-2 border border-primary-red/30 rounded-md disabled:opacity-50">
                      Reject
                    </button>
                  </div>
                )}

                {r.status === 'Accepted' && (
                  <button disabled={actioningId === r._id} onClick={() => advance(r._id, 'En Route')}
                    className="bg-primary-red text-white text-sm font-medium px-4 py-2 rounded-md mt-3 disabled:opacity-50">
                    Mark En Route
                  </button>
                )}

                {r.status === 'En Route' && (
                  <button disabled={actioningId === r._id} onClick={() => advance(r._id, 'Completed')}
                    className="bg-primary-red text-white text-sm font-medium px-4 py-2 rounded-md mt-3 disabled:opacity-50">
                    Mark Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}