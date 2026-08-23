import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizerSidebar from '../components/CustomizerSidebar';
import { CATEGORY_META } from '../constants/customizationCategories';
import { apiFetch } from '../api/client';

const EMPTY_SELECTION = { make: '', model: '', year: '' };

function ChevronIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function VehicleDropdown({ label, value, options, onChange, placeholder, disabled }) {
  return (
    <label
      className={
        'relative flex-1 min-w-[140px] flex flex-col gap-0.5 rounded-lg border px-3 py-1.5 transition-colors ' +
        (disabled
          ? 'bg-gray-50 border-gray-200'
          : 'border-gray-300 focus-within:border-primary-red focus-within:ring-2 focus-within:ring-primary-red/15')
      }
    >
      <span className="text-xs text-gray-400">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent outline-none text-sm pr-6 disabled:text-gray-300 disabled:cursor-not-allowed"
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
      <ChevronIcon className={'w-4 h-4 absolute right-3 bottom-2 pointer-events-none ' + (disabled ? 'text-gray-300' : 'text-gray-400')} />
    </label>
  );
}

export default function SelectVehicle() {
  const navigate = useNavigate();
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="h-16 px-6 flex items-center border-b border-gray-200 bg-white shrink-0">
        <span className="text-lg font-semibold tracking-tight">
          MOTO<span className="text-primary-red">FIX</span>
        </span>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <CustomizerSidebar activeStep="select-vehicle" />

        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-8">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            <span className="text-primary-red">Select</span> Your Vehicle
          </h1>
          <p className="text-sm text-gray-500 mt-1 mb-6 max-w-xl">
            Choose the make, model and year of your car or motorbike — we will load the best
            customization options for your vehicle.
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
              </svg>
              {error}
            </div>
          )}

          {makes.length === 0 && !error && (
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 border-t-primary-red animate-spin" />
              Loading available vehicles…
            </div>
          )}

          <form onSubmit={handleLoadVehicle} className="flex flex-wrap gap-3 items-end mb-6">
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
              className="bg-primary-red text-white px-5 h-[46px] rounded-lg text-sm font-medium shadow-sm disabled:opacity-40 disabled:shadow-none hover:bg-dark-red transition-colors flex items-center gap-2 shrink-0"
            >
              {loading && <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
              {loading ? 'Loading…' : 'Load Vehicle'}
              {!loading && <span aria-hidden>&rarr;</span>}
            </button>
          </form>

          {vehicle && (
            <>
              <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row gap-6 sm:gap-8 mb-6">
                <div className="w-64 h-40 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                  <img
                    src={vehicle.baseImageUrl}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-base">
                    {vehicle.make} {vehicle.model}
                  </p>
                  <span className="inline-block bg-light-red-bg text-primary-red text-xs font-medium px-2 py-0.5 rounded-full mt-1 mb-4">
                    {vehicle.year}
                  </span>
                  <dl className="text-sm grid grid-cols-[auto_auto] gap-x-6 gap-y-2">
                    <dt className="text-gray-400 uppercase text-xs tracking-wide self-center">Make</dt>
                    <dd className="text-gray-700 font-medium">{vehicle.make}</dd>
                    <dt className="text-gray-400 uppercase text-xs tracking-wide self-center">Model</dt>
                    <dd className="text-gray-700 font-medium">{vehicle.model}</dd>
                    <dt className="text-gray-400 uppercase text-xs tracking-wide self-center">Year</dt>
                    <dd className="text-gray-700 font-medium">{vehicle.year}</dd>
                    <dt className="text-gray-400 uppercase text-xs tracking-wide self-center">Body type</dt>
                    <dd className="text-gray-700 font-medium">{vehicle.bodyType}</dd>
                  </dl>
                </div>
              </div>

              <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
                <p className="font-semibold text-gray-900 mb-4">
                  Available Customization Categories
                  <span className="text-gray-400 font-normal text-sm"> ({vehicle.customizationCategories.length})</span>
                </p>
                <div className="flex flex-wrap gap-4">
                  {vehicle.customizationCategories.map((key) => {
                    const meta = CATEGORY_META[key];
                    if (!meta) return null;
                    const Icon = meta.icon;
                    return (
                      <div key={key} className="w-20 flex flex-col items-center gap-2 text-center group">
                        <span className="w-12 h-12 rounded-full bg-light-red-bg flex items-center justify-center group-hover:bg-primary-red/15 transition-colors">
                          <Icon className="w-5 h-5 text-primary-red" />
                        </span>
                        <span className="text-xs font-medium text-gray-600">{meta.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => {
                    const params = new URLSearchParams(selection).toString();
                    navigate(`/customize/build?${params}`);
                  }}
                  className="bg-primary-red text-white px-5 h-[46px] rounded-lg text-sm font-medium shadow-sm hover:bg-dark-red transition-colors flex items-center gap-2"
                >
                  Continue to Customize
                  <span aria-hidden>&rarr;</span>
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
