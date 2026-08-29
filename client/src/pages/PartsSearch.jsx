import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import PartCard from '../components/PartCard';
import { apiFetch } from '../api/client';
import { PART_CATEGORY_LABELS } from '../constants/partCategories';

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

  // Filters apply client-side over the vehicle's already-fetched compatible
  // parts, so results update instantly with no extra round trip per change.
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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
    setCategory('');
    setBrand('');
    setMinPrice('');
    setMaxPrice('');
    if (!make || !model || !year) return;
    setLoading(true);
    apiFetch(
      `/parts/search?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&year=${encodeURIComponent(year)}`
    )
      .then(setParts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [year]);

  const brands = useMemo(
    () => [...new Set((parts || []).map((p) => p.brand))].sort(),
    [parts]
  );

  const filteredParts = useMemo(() => {
    if (!parts) return parts;
    const min = minPrice === '' ? -Infinity : Number(minPrice);
    const max = maxPrice === '' ? Infinity : Number(maxPrice);
    return parts.filter(
      (p) =>
        (!category || p.category === category) &&
        (!brand || p.brand === brand) &&
        p.price >= min &&
        p.price <= max
    );
  }, [parts, category, brand, minPrice, maxPrice]);

  return (
    <div>
      <Navbar active="Find Parts" />
      <div className="max-w-6xl mx-auto px-6 py-6">
        <h1 className="font-display font-semibold text-3xl text-dark-red">Find compatible parts</h1>
        <p className="text-sm text-gray-500 mt-1 mb-5">
          Select your vehicle's make, model, and year to see matching parts.
        </p>

        {error && <p className="text-sm text-primary-red mb-4">{error}</p>}

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="border border-primary-red rounded-md px-4 py-3 text-base min-w-[160px]"
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
            className="border border-primary-red rounded-md px-4 py-3 text-base min-w-[160px] disabled:opacity-50"
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
            className="border border-primary-red rounded-md px-4 py-3 text-base min-w-[160px] disabled:opacity-50"
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {parts && parts.length > 0 && (
          <div className="flex flex-wrap items-end gap-4 mb-6 pb-5 border-b border-gray-200">
            <label className="flex flex-col gap-1.5 text-sm text-gray-500">
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-primary-red rounded-md px-4 py-3 text-base min-w-[170px]"
              >
                <option value="">All categories</option>
                {Object.entries(PART_CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm text-gray-500">
              Brand
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="border border-primary-red rounded-md px-4 py-3 text-base min-w-[170px]"
              >
                <option value="">All brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 text-sm text-gray-500">
              Min price
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="৳0"
                className="border border-primary-red rounded-md px-4 py-3 text-base w-32"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm text-gray-500">
              Max price
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Any"
                className="border border-primary-red rounded-md px-4 py-3 text-base w-32"
              />
            </label>

            {(category || brand || minPrice !== '' || maxPrice !== '') && (
              <button
                onClick={() => {
                  setCategory('');
                  setBrand('');
                  setMinPrice('');
                  setMaxPrice('');
                }}
                className="text-sm text-primary-red underline pb-3"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : parts === null ? (
          <p className="text-sm text-gray-400">Choose a make, model, and year to search.</p>
        ) : parts.length === 0 ? (
          <p className="text-sm text-gray-400">No compatible parts found for this vehicle.</p>
        ) : filteredParts.length === 0 ? (
          <p className="text-sm text-gray-400">No parts match your filters.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredParts.map((part) => (
              <PartCard key={part._id} part={part} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
