import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { apiFetch } from '../api/client';

export default function PartsSearch() {
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');

  const [parts, setParts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/vehicles/makes').then(setMakes).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    setModel('');
    setYear('');
    setModels([]);
    setYears([]);
    setParts(null);
    if (!make) return;
    apiFetch(`/vehicles/models?make=${encodeURIComponent(make)}`)
      .then(setModels)
      .catch((err) => setError(err.message));
  }, [make]);

  useEffect(() => {
    setYear('');
    setYears([]);
    setParts(null);
    if (!make || !model) return;
    apiFetch(`/vehicles/years?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`)
      .then(setYears)
      .catch((err) => setError(err.message));
  }, [model]);

  useEffect(() => {
    setParts(null);
    if (!make || !model || !year) return;
    setLoading(true);
    apiFetch(
      `/parts/search?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}`
    )
      .then(setParts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [year]);

  return (
    <div>
      <Navbar active="Find Parts" />
      <div className="max-w-3xl mx-auto px-6 py-6">
        <h1 className="text-2xl font-medium text-dark-red">Find compatible parts</h1>
        <p className="text-sm text-gray-500 mt-1 mb-5">
          Select your vehicle's make, model, and year to see matching parts.
        </p>

        {error && <p className="text-sm text-primary-red mb-4">{error}</p>}

        <div className="flex gap-3 mb-6">
          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="border border-primary-red rounded px-3 py-2 text-sm"
          >
            <option value="">Make</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!make}
            className="border border-primary-red rounded px-3 py-2 text-sm disabled:opacity-50"
          >
            <option value="">Model</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={!model}
            className="border border-primary-red rounded px-3 py-2 text-sm disabled:opacity-50"
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : parts === null ? (
          <p className="text-sm text-gray-400">Choose a make, model, and year to search.</p>
        ) : parts.length === 0 ? (
          <p className="text-sm text-gray-400">No compatible parts found for this vehicle.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {parts.map((part) => (
              <div
                key={part._id}
                className="bg-light-red-bg border border-primary-red rounded-lg px-5 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-dark-red text-sm">{part.name}</p>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{part.category}</p>
                </div>
                <span className="font-medium text-primary-red text-sm">{`৳${part.price}`}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
