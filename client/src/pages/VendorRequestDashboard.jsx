import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
<<<<<<< HEAD
import RequestMap from '../components/RequestMap';
=======
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
import { apiFetch } from '../api/client';

const STATUS_STYLE = {
  Pending: 'bg-light-red-bg text-dark-red border-primary-red/30',
  Accepted: 'bg-white text-dark-red border-primary-red/30',
  'En Route': 'bg-white text-dark-red border-primary-red/30',
  Completed: 'bg-gray-50 text-gray-500 border-gray-200',
  Cancelled: 'bg-gray-50 text-gray-400 border-gray-200',
};

<<<<<<< HEAD
const ACTIVE_STATUSES = ['Pending', 'Accepted', 'En Route'];

const formatDistance = (m) => (m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`);
const formatDuration = (s) => {
  const mins = Math.round(s / 60);
  return mins < 1 ? '<1 min' : `${mins} min`;
};

export default function VendorRequestDashboard() {
  const [requests, setRequests] = useState([]);
  const [mechanicLocation, setMechanicLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState(null);
  const [routes, setRoutes] = useState({});

  const load = async () => {
    try {
      const data = await apiFetch('/vendor/requests');
      setRequests(data.requests);
      setMechanicLocation(data.mechanicLocation);
=======
export default function VendorRequestDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState(null);

  const load = async () => {
    try {
      setRequests(await apiFetch('/vendor/requests'));
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

<<<<<<< HEAD
  useEffect(() => {
    requests
      .filter((r) => ['Accepted', 'En Route'].includes(r.status) && !routes[r._id])
      .forEach(async (r) => {
        try {
          const route = await apiFetch(`/vendor/requests/${r._id}/route`);
          setRoutes((prev) => ({ ...prev, [r._id]: route }));
        } catch {
          // No route available — the card just won't show a map for this one.
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests]);

=======
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
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

<<<<<<< HEAD
  const activeRequests = requests.filter((r) => ACTIVE_STATUSES.includes(r.status));

=======
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
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

<<<<<<< HEAD
        {!loading && mechanicLocation?.coordinates && activeRequests.length > 0 && (
          <div className="mt-6">
            <RequestMap
              self={{ lat: mechanicLocation.coordinates[1], lng: mechanicLocation.coordinates[0], label: 'Your shop' }}
              markers={activeRequests.map((r) => ({
                id: r._id,
                lat: r.location.lat,
                lng: r.location.lng,
                label: `${r.issueCategory}${r.locationName ? ` — ${r.locationName}` : ''}${
                  r.distanceFromMe ? ` (${formatDistance(r.distanceFromMe.distance)}, ${formatDuration(r.distanceFromMe.duration)})` : ''
                }`,
              }))}
            />
          </div>
        )}

=======
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
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
<<<<<<< HEAD
                    {r.locationName && <p className="text-sm opacity-70 mt-0.5">{r.locationName}</p>}
                    <p className="text-xs opacity-60 mt-0.5">{new Date(r.createdAt).toLocaleString()}</p>
                    {r.distanceFromMe && (
                      <p className="text-xs opacity-60 mt-0.5">
                        {formatDistance(r.distanceFromMe.distance)} &middot; {formatDuration(r.distanceFromMe.duration)} away
                        {r.distanceFromMe.estimated && ' (estimated)'}
                      </p>
                    )}
=======
                    <p className="text-xs opacity-60 mt-0.5">{new Date(r.createdAt).toLocaleString()}</p>
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
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

<<<<<<< HEAD
                {['Accepted', 'En Route'].includes(r.status) && mechanicLocation?.coordinates && (
                  <div className="mt-3">
                    <RequestMap
                      self={{ lat: mechanicLocation.coordinates[1], lng: mechanicLocation.coordinates[0], label: 'Your shop' }}
                      markers={[{
                        id: r._id,
                        lat: r.location.lat,
                        lng: r.location.lng,
                        label: r.locationName ? `${r.customer?.name || 'Customer'} — ${r.locationName}` : (r.customer?.name || 'Customer'),
                      }]}
                      route={routes[r._id]?.coordinates?.map(([lng, lat]) => [lat, lng])}
                      height={200}
                    />
                    {routes[r._id] && (
                      <p className="text-xs text-gray-500 mt-1.5">
                        {formatDistance(routes[r._id].distance)} &middot; {formatDuration(routes[r._id].duration)}
                        {routes[r._id].estimated && ' (estimated)'}
                      </p>
                    )}
                  </div>
                )}

=======
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
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