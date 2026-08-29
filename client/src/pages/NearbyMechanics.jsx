import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from '../components/Navbar';
import { apiFetch } from '../api/client';

const customerIcon = L.divIcon({
  className: '',
  html: '<div style="width:16px;height:16px;background:#D62839;border:3px solid white;border-radius:50%;box-shadow:0 0 4px rgba(0,0,0,0.4);"></div>',
  iconSize: [16, 16],
});

const mechanicIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;background:#1A1414;border:2px solid white;border-radius:50%;box-shadow:0 0 4px rgba(0,0,0,0.4);"></div>',
  iconSize: [14, 14],
});

const formatDistance = (m) => (m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`);
const formatDuration = (s) => {
  const mins = Math.round(s / 60);
  return mins < 1 ? '<1 min' : `${mins} min`;
};

export default function NearbyMechanics() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [requestLocation, setRequestLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch(`/requests/${requestId}/nearby-mechanics`);
        setCandidates(data.candidates);
        setRequestLocation(data.requestLocation);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [requestId]);

  const handleSend = async (vendorId) => {
    setSendingId(vendorId);
    setError('');
    try {
      await apiFetch(`/requests/${requestId}/assign`, { method: 'PATCH', body: JSON.stringify({ vendorId }) });
      navigate('/roadside-request');
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div>
      <Navbar active="Roadside Help" />
      <div className="max-w-3xl mx-auto px-8 py-10">
        <h1 className="font-display font-semibold text-3xl text-dark-red">Nearby Mechanics</h1>
        <p className="text-gray-500 mt-2">Pick a mechanic to send your request to.</p>

        {error && (
          <p className="text-sm text-primary-red bg-light-red-bg border border-primary-red/30 rounded-md px-4 py-3 mt-5">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-gray-400 mt-6">Finding nearby mechanics&hellip;</p>
        ) : candidates.length === 0 ? (
          <div className="border border-dashed border-primary-red/30 rounded-xl px-6 py-10 text-center mt-6">
            <p className="font-medium text-dark-red">No available mechanics found nearby</p>
            <p className="text-sm text-gray-500 mt-1">Try again shortly — availability changes as mechanics come online.</p>
          </div>
        ) : (
          <>
            {requestLocation && (
              <div className="rounded-xl overflow-hidden mt-6 border border-gray-200" style={{ height: 280 }}>
                <MapContainer center={[requestLocation.lat, requestLocation.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[requestLocation.lat, requestLocation.lng]} icon={customerIcon}>
                    <Popup>You</Popup>
                  </Marker>
                  {candidates.map((c) => (
                    <Marker key={c.id} position={[c.location.coordinates[1], c.location.coordinates[0]]} icon={mechanicIcon}>
                      <Popup>{c.businessName}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )}

            <div className="flex flex-col gap-3 mt-6">
              {candidates.map((c) => (
                <div key={c.id} className="bg-light-red-bg border border-primary-red/30 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-dark-red">{c.businessName}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {formatDistance(c.distanceMeters)} &middot; {formatDuration(c.durationSeconds)} away
                      {c.estimated && ' (estimated)'}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {c.averageRating ? `\u2605 ${c.averageRating.toFixed(1)} (${c.ratingCount})` : 'No ratings yet'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSend(c.id)}
                    disabled={sendingId === c.id}
                    className="bg-primary-red hover:bg-dark-red transition-colors text-white text-sm font-medium px-4 py-2 rounded-md disabled:opacity-50 shrink-0"
                  >
                    {sendingId === c.id ? 'Sending…' : 'Send Request'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}