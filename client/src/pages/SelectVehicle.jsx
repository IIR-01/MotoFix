import { useEffect, useMemo, useState } from 'react';
import CustomizerSidebar from '../components/CustomizerSidebar';
import { CATEGORY_META } from '../constants/customizationCategories';
import { apiFetch } from '../api/client';

const EMPTY_SELECTION = { make: '', model: '', year: '' };

function VehicleDropdown({ label, value, options, onChange, placeholder, disabled }) {
  return (
    <label className="flex-1 flex flex-col gap-0.5 border border-gray-300 rounded px-3 py-1.5">
      <span className="text-xs text-gray-400">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm bg-transparent outline-none disabled:text-gray-300"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function SelectVehicle() {
  const [options, setOptions] = useState([]);
  const [selection, setSelection] = useState(EMPTY_SELECTION);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/customization/vehicles')
      .then(setOptions)
      .catch((err) => setError(err.message));
  }, []);

  const makes = useMemo(() => [...new Set(options.map((o) => o.make))], [options]);

  const models = useMemo(
    () => [...new Set(options.filter((o) => o.make === selection.make).map((o) => o.model))],
    [options, selection.make]
  );

  const years = useMemo(
    () =>
      [
        ...new Set(
          options
            .filter((o) => o.make === selection.make && o.model === selection.model)
            .map((o) => o.year)
        ),
      ].sort((a, b) => b - a),
    [options, selection.make, selection.model]
  );

  const handleMakeChange = (make) => {
    setSelection({ make, model: '', year: '' });
    setVehicle(null);
  };

  const handleModelChange = (model) => {
    setSelection((prev) => ({ ...prev, model, year: '' }));
    setVehicle(null);
  };

  const handleYearChange = (year) => {
    setSelection((prev) => ({ ...prev, year }));
    setVehicle(null);
  };

  const handleLoadVehicle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const params = new URLSearchParams(selection).toString();
      setVehicle(await apiFetch(`/customization/vehicles/lookup?${params}`));
    } catch (err) {
      setError(err.message);
      setVehicle(null);
    } finally {
      setLoading(false);
    }
  };

  const canLoad = selection.make && selection.model && selection.year;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="h-16 px-6 flex items-center border-b border-gray-200 shrink-0">
        <span className="text-lg font-semibold">
          MOTO<span className="text-primary-red">FIX</span>
        </span>
      </header>

      <div className="flex flex-1">
        <CustomizerSidebar activeStep="select-vehicle" />

        <main className="flex-1 px-8 py-8 max-w-4xl">
          <h1 className="text-2xl font-medium">
            <span className="text-primary-red">Select</span> Your Vehicle
          </h1>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Choose the make, model and year of your car or motorbike — we will load the best
            customization options for your vehicle.
          </p>

          {error && <p className="text-sm text-primary-red mb-4">{error}</p>}

          {makes.length === 0 && !error && (
            <p className="text-sm text-gray-400 mb-4">Loading available vehicles…</p>
          )}

          <form onSubmit={handleLoadVehicle} className="flex gap-3 items-end mb-6">
            <VehicleDropdown
              label="Make"
              value={selection.make}
              options={makes}
              onChange={handleMakeChange}
              placeholder="Select make"
            />
            <VehicleDropdown
              label="Model"
              value={selection.model}
              options={models}
              onChange={handleModelChange}
              placeholder="Select model"
              disabled={!selection.make}
            />
            <VehicleDropdown
              label="Year"
              value={selection.year}
              options={years}
              onChange={handleYearChange}
              placeholder="Select year"
              disabled={!selection.model}
            />
            <button
              type="submit"
              disabled={!canLoad || loading}
              className="bg-primary-red text-white px-5 h-[46px] rounded text-sm font-medium disabled:opacity-40 flex items-center gap-2 shrink-0"
            >
              {loading ? 'Loading…' : 'Load Vehicle'}
              <span aria-hidden>&rarr;</span>
            </button>
          </form>

          {vehicle && (
            <>
              <div className="border border-gray-200 rounded-lg p-5 flex gap-8 mb-6">
                <img
                  src={vehicle.baseImageUrl}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-64 h-40 object-contain shrink-0"
                />
                <div>
                  <p className="font-medium">
                    {vehicle.make} {vehicle.model}
                  </p>
                  <p className="text-primary-red text-sm mb-3">{vehicle.year}</p>
                  <dl className="text-sm text-gray-600 grid grid-cols-[auto_auto] gap-x-6 gap-y-1.5">
                    <dt className="text-gray-400">Make</dt>
                    <dd>{vehicle.make}</dd>
                    <dt className="text-gray-400">Model</dt>
                    <dd>{vehicle.model}</dd>
                    <dt className="text-gray-400">Year</dt>
                    <dd>{vehicle.year}</dd>
                    <dt className="text-gray-400">Body type</dt>
                    <dd>{vehicle.bodyType}</dd>
                  </dl>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-5">
                <p className="font-medium mb-4">Available Customization Categories</p>
                <div className="flex flex-wrap gap-8">
                  {vehicle.customizationCategories.map((key) => {
                    const meta = CATEGORY_META[key];
                    if (!meta) return null;
                    const Icon = meta.icon;
                    return (
                      <div key={key} className="flex flex-col items-center gap-2 text-sm text-gray-600">
                        <Icon className="w-6 h-6 text-primary-red" />
                        {meta.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
