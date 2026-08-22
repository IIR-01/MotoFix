import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { apiFetch } from '../api/client';

const ISSUES = ['Flat Tire', 'Battery Failure', 'Engine Trouble', 'Other'];

export default function RequestRoadsideAssistance() {
  const [issue, setIssue] = useState('Flat Tire');
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const captureLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => {
        setLocationError('Could not get your location. Please allow location access and try again.');
      }
    );
  };

  const loadRequests = async () => {
    try {
      setRequests(await apiFetch('/requests/mine'));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    captureLocation();
    loadRequests();
  }, []);

  const handleSubmit = async () => {
    if (!location) {
      setLocationError('Share your location before submitting.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await apiFetch('/requests', {
        method: 'POST',
        body: JSON.stringify({ issueCategory: issue, location }),
      });
      loadRequests();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar active="Roadside Help" />
      <div className="max-w-2xl mx-auto px-8 py-10">
        <h1 className="font-display font-semibold text-3xl text-dark-red">Request Roadside Assistance</h1>
        <p className="text-gray-500 mt-2">Tell us what happened and share your current location.</p>

        {error && (
          <p className="text-sm text-primary-red bg-light-red-bg border border-primary-red/30 rounded-md px-4 py-3 mt-5">
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
          {ISSUES.map((option) => (
            <button
              key={option}
              onClick={() => setIssue(option)}
              className={
                issue === option
                  ? 'bg-primary-red text-white rounded-lg py-4 px-3 text-sm font-medium'
                  : 'bg-light-red-bg text-dark-red border border-primary-red/40 rounded-lg py-4 px-3 text-sm'
              }
            >
              {option}
            </button>
          ))}
        </div>

        <div className="bg-gray-100 rounded-xl mt-6 py-10 flex flex-col items-center justify-center gap-2 text-center">
          <span className="w-3.5 h-3.5 bg-primary-red rounded-full" />
          {location ? (
            <p className="font-medium text-dark-red text-sm">
              Location shared &mdash; {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          ) : (
            <p className="text-sm text-gray-500">Sharing your current location&hellip;</p>
          )}
          {locationError && (
            <>
              <p className="text-sm text-primary-red mt-1">{locationError}</p>
              <button onClick={captureLocation} className="text-sm text-primary-red underline mt-1">
                Try again
              </button>
            </>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-primary-red hover:bg-dark-red transition-colors text-white font-medium py-3.5 rounded-md w-full mt-6 disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit Request'}
        </button>

        {requests.length > 0 && (
          <div className="mt-10">
            <p className="font-medium text-dark-red mb-3">Your requests</p>
            <div className="flex flex-col gap-3">
              {requests.map((r) => (
                <div
                  key={r._id}
                  className="bg-light-red-bg border border-primary-red/30 rounded-lg px-5 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-dark-red text-sm">{r.issueCategory}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{new Date(r.createdAt).toLocaleString()}</p>
                  </div>
                  <span className="bg-white border border-primary-red/30 text-dark-red text-xs px-3 py-1.5 rounded-full">
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}