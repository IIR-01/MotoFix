import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
<<<<<<< HEAD
import RequestMap from '../components/RequestMap';
import { apiFetch, reverseGeocode } from '../api/client';

const ISSUES = ['Flat Tire', 'Battery Failure', 'Engine Trouble', 'Other'];

const formatDistance = (m) => (m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`);
const formatDuration = (s) => {
  const mins = Math.round(s / 60);
  return mins < 1 ? '<1 min' : `${mins} min`;
};

=======
import { apiFetch } from '../api/client';

const ISSUES = ['Flat Tire', 'Battery Failure', 'Engine Trouble', 'Other'];

>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
function RatingForm({ request, onRated }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!rating) { setError('Pick a star rating first.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await apiFetch(`/requests/${request._id}/rate`, { method: 'PATCH', body: JSON.stringify({ rating, review }) });
      onRated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-light-red-bg border border-primary-red/30 rounded-lg px-5 py-4 mt-2">
      <p className="text-sm font-medium text-dark-red mb-2">How was the service?</p>
      {error && <p className="text-sm text-primary-red mb-2">{error}</p>}
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setRating(n)} className={`text-2xl leading-none ${n <= rating ? 'text-primary-red' : 'text-gray-300'}`}>
            &#9733;
          </button>
        ))}
      </div>
      <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Optional review"
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-3" rows={2} />
      <button onClick={submit} disabled={submitting} className="bg-primary-red text-white text-sm font-medium px-4 py-2 rounded-md disabled:opacity-50">
        {submitting ? 'Submitting…' : 'Submit Rating'}
      </button>
    </div>
  );
}

export default function RequestRoadsideAssistance() {
  const [issue, setIssue] = useState('Flat Tire');
  const [location, setLocation] = useState(null);
<<<<<<< HEAD
  const [locationName, setLocationName] = useState('');
  const [resolvingName, setResolvingName] = useState(false);
=======
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
  const [locationError, setLocationError] = useState('');
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
<<<<<<< HEAD
  const [routes, setRoutes] = useState({});

  const captureLocation = () => {
    setLocationError('');
    setLocationName('');
    if (!navigator.geolocation) { setLocationError('Geolocation is not supported by your browser.'); return; }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setLocation(coords);
        setResolvingName(true);
        const name = await reverseGeocode(coords.lat, coords.lng);
        setLocationName(name || '');
        setResolvingName(false);
      },
=======

  const captureLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) { setLocationError('Geolocation is not supported by your browser.'); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
      () => setLocationError('Could not get your location. Please allow location access and try again.')
    );
  };

  const loadRequests = async () => {
    try { setRequests(await apiFetch('/requests/mine')); } catch (err) { setError(err.message); }
  };

  useEffect(() => { captureLocation(); loadRequests(); }, []);

<<<<<<< HEAD
  useEffect(() => {
    requests
      .filter((r) => ['Accepted', 'En Route'].includes(r.status) && !routes[r._id])
      .forEach(async (r) => {
        try {
          const route = await apiFetch(`/requests/${r._id}/route`);
          setRoutes((prev) => ({ ...prev, [r._id]: route }));
        } catch {
          // No route yet — just skip the map for this one.
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests]);

=======
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
  const handleSubmit = async () => {
    if (!location) { setLocationError('Share your location before submitting.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await apiFetch('/requests', { method: 'POST', body: JSON.stringify({ issueCategory: issue, location }) });
      loadRequests();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    setError('');
    try { await apiFetch(`/requests/${id}`, { method: 'DELETE' }); loadRequests(); }
    catch (err) { setError(err.message); }
    finally { setBusyId(null); }
  };

  const handleCancel = async (id) => {
    setBusyId(id);
    setError('');
    try { await apiFetch(`/requests/${id}/cancel`, { method: 'PATCH' }); loadRequests(); }
    catch (err) { setError(err.message); }
    finally { setBusyId(null); }
  };

  return (
    <div>
      <Navbar active="Roadside Help" />
      <div className="max-w-2xl mx-auto px-8 py-10">
        <h1 className="font-display font-semibold text-3xl text-dark-red">Request Roadside Assistance</h1>
        <p className="text-gray-500 mt-2">Tell us what happened and share your current location.</p>

        {error && (
          <p className="text-sm text-primary-red bg-light-red-bg border border-primary-red/30 rounded-md px-4 py-3 mt-5">{error}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
          {ISSUES.map((option) => (
            <button key={option} onClick={() => setIssue(option)}
              className={issue === option
                ? 'bg-primary-red text-white rounded-lg py-4 px-3 text-sm font-medium'
                : 'bg-light-red-bg text-dark-red border border-primary-red/40 rounded-lg py-4 px-3 text-sm'}>
              {option}
            </button>
          ))}
        </div>

        <div className="bg-gray-100 rounded-xl mt-6 py-10 flex flex-col items-center justify-center gap-2 text-center">
          <span className="w-3.5 h-3.5 bg-primary-red rounded-full" />
          {location ? (
            <p className="font-medium text-dark-red text-sm">
<<<<<<< HEAD
              Location shared &mdash; {resolvingName ? 'looking up address…' : (locationName || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`)}
=======
              Location shared &mdash; {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
            </p>
          ) : (
            <p className="text-sm text-gray-500">Sharing your current location&hellip;</p>
          )}
          {locationError && (
            <>
              <p className="text-sm text-primary-red mt-1">{locationError}</p>
              <button onClick={captureLocation} className="text-sm text-primary-red underline mt-1">Try again</button>
            </>
          )}
        </div>

        <button onClick={handleSubmit} disabled={submitting}
          className="bg-primary-red hover:bg-dark-red transition-colors text-white font-medium py-3.5 rounded-md w-full mt-6 disabled:opacity-50">
          {submitting ? 'Submitting…' : 'Submit Request'}
        </button>

        {requests.length > 0 && (
          <div className="mt-10">
            <p className="font-medium text-dark-red mb-3">Your requests</p>
            <div className="flex flex-col gap-3">
              {requests.map((r) => (
                <div key={r._id} className="bg-light-red-bg border border-primary-red/30 rounded-lg px-5 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-dark-red text-sm">{r.issueCategory}</p>
<<<<<<< HEAD
                      {r.locationName && <p className="text-xs text-gray-500 mt-0.5">{r.locationName}</p>}
=======
>>>>>>> 1ac65f253f4e61b550de509defdd255d6ba8b75f
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(r.createdAt).toLocaleString()}</p>
                      {r.targetVendor && <p className="text-xs text-gray-500 mt-0.5">Sent to {r.targetVendor.businessName}</p>}
                    </div>
                    <span className="bg-white border border-primary-red/30 text-dark-red text-xs px-3 py-1.5 rounded-full shrink-0">
                      {r.status}
                    </span>
                  </div>

<<<<<<< HEAD
                  {['Accepted', 'En Route'].includes(r.status) && r.targetVendor?.location?.coordinates && (
                    <div className="mt-3">
                      <RequestMap
                        self={{ lat: r.location.lat, lng: r.location.lng, label: 'You' }}
                        markers={[{
                          id: r._id,
                          lat: r.targetVendor.location.coordinates[1],
                          lng: r.targetVendor.location.coordinates[0],
                          label: r.targetVendor.businessName,
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
                  <div className="flex gap-3 mt-3 flex-wrap">
                    {r.status === 'Pending' && !r.targetVendor && (
                      <Link to={`/roadside-request/${r._id}/mechanics`} className="bg-primary-red text-white text-xs font-medium px-3 py-1.5 rounded-md">
                        Find a mechanic
                      </Link>
                    )}
                    {r.status === 'Pending' && (
                      <button disabled={busyId === r._id} onClick={() => handleDelete(r._id)} className="text-dark-red text-xs underline disabled:opacity-50">
                        Delete
                      </button>
                    )}
                    {['Accepted', 'En Route'].includes(r.status) && (
                      <button disabled={busyId === r._id} onClick={() => handleCancel(r._id)} className="text-dark-red text-xs underline disabled:opacity-50">
                        Cancel
                      </button>
                    )}
                  </div>

                  {r.status === 'Completed' && r.rating === null && <RatingForm request={r} onRated={loadRequests} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}