import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import CustomizerSidebar from '../components/CustomizerSidebar';
import { CATEGORY_META } from '../constants/customizationCategories';
import { apiFetch } from '../api/client';

function ChevronIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function PhotoThumbnailRow({ options, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          title={opt.label}
          onClick={() => onSelect(opt.key)}
          className={
            'w-16 h-16 rounded-lg border-2 overflow-hidden relative transition-transform ' +
            (selected === opt.key ? 'border-primary-red scale-105' : 'border-gray-200 hover:border-gray-300')
          }
        >
          <img src={opt.imageUrl} alt={opt.label} className="w-full h-full object-cover" />
          {selected === opt.key && (
            <span className="absolute bottom-0 right-0 bg-primary-red text-white rounded-tl-md p-0.5">
              <CheckIcon className="w-3 h-3" />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function ShapeOptionList({ options, selected, onSelect }) {
  return (
    <div className="flex flex-col gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onSelect(opt.key)}
          className={
            'flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm transition-colors ' +
            (selected === opt.key
              ? 'bg-light-red-bg text-primary-red font-medium'
              : 'text-gray-600 hover:bg-gray-50')
          }
        >
          {opt.label}
          {selected === opt.key && <CheckIcon className="w-4 h-4" />}
        </button>
      ))}
    </div>
  );
}

function CategorySection({ category, options, selected, onSelect, isOpen, onToggle }) {
  const meta = CATEGORY_META[category];
  if (!meta || options.length === 0) return null;
  const Icon = meta.icon;
  // If every option in this category has a real photo for this vehicle,
  // show photo thumbnails instead of a plain text list.
  const hasPhotoCoverage = options.every((o) => o.imageUrl);
  const selectedLabel = options.find((o) => o.key === selected)?.label;

  return (
    <div className="border-b border-gray-100 last:border-b-0 py-3">
      <button type="button" onClick={onToggle} className="w-full flex items-center justify-between gap-3">
        <span className="flex items-center gap-2.5">
          <Icon className="w-4.5 h-4.5 text-primary-red" />
          <span className="text-sm font-medium text-gray-800">{meta.label}</span>
          {!isOpen && selectedLabel && <span className="text-xs text-gray-400">{selectedLabel}</span>}
        </span>
        <ChevronIcon className={'w-4 h-4 text-gray-400 transition-transform ' + (isOpen ? 'rotate-180' : '')} />
      </button>

      {isOpen && (
        <div className="mt-3 pl-1">
          {hasPhotoCoverage ? (
            <PhotoThumbnailRow options={options} selected={selected} onSelect={onSelect} />
          ) : (
            <ShapeOptionList options={options} selected={selected} onSelect={onSelect} />
          )}
        </div>
      )}
    </div>
  );
}

export default function Customize() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const make = searchParams.get('make');
  const model = searchParams.get('model');
  const year = searchParams.get('year');

  const [vehicle, setVehicle] = useState(null);
  const [allOptions, setAllOptions] = useState([]);
  const [selection, setSelection] = useState({});
  const [openCategory, setOpenCategory] = useState(null);
  const [activePhotoUrl, setActivePhotoUrl] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!make || !model || !year) {
      navigate('/customize');
      return;
    }
    setError('');
    const params = new URLSearchParams({ make, model, year }).toString();
    apiFetch(`/customization/vehicles/lookup?${params}`)
      .then((v) => {
        setVehicle(v);
        setActivePhotoUrl(v.baseImageUrl);
      })
      .catch((err) => setError(err.message));
  }, [make, model, year, navigate]);

  useEffect(() => {
    if (!vehicle) return;
    apiFetch(`/customization/options?bodyType=${encodeURIComponent(vehicle.bodyType)}`)
      .then((opts) => {
        setAllOptions(opts);
        setOpenCategory(vehicle.customizationCategories[0] || null);
      })
      .catch((err) => setError(err.message));
  }, [vehicle]);

  const optionsByCategory = useMemo(() => {
    if (!vehicle) return {};
    const map = { paint_color: [] };
    allOptions.forEach((o) => {
      if (!map[o.category]) map[o.category] = [];
      map[o.category].push(o);
    });

    // paint_color has no generic bodyType data — it's always the vehicle's
    // own real photos, with the base photo as the implicit "stock" choice.
    map.paint_color = [
      { key: 'stock', label: 'Stock', imageUrl: vehicle.baseImageUrl },
      ...(vehicle.photoOptions?.paint_color || []),
    ];

    // For any other category where this vehicle has real photos for some of
    // its options, attach them — any option without a matching real photo
    // falls back to the base ("no change") photo instead.
    Object.entries(vehicle.photoOptions || {}).forEach(([category, photos]) => {
      if (category === 'paint_color' || !map[category]) return;
      map[category] = map[category].map((opt) => ({
        ...opt,
        imageUrl: photos.find((p) => p.key === opt.key)?.imageUrl || vehicle.baseImageUrl,
      }));
    });

    // Full override: replaces a category's option list entirely (e.g. only
    // "Black and White" rims instead of the shared stock/sport/alloy set),
    // instead of layering onto it.
    Object.entries(vehicle.optionOverrides || {}).forEach(([category, options]) => {
      map[category] = options;
    });

    return map;
  }, [allOptions, vehicle]);

  useEffect(() => {
    if (!vehicle || Object.keys(optionsByCategory).length === 0) return;
    setSelection((prev) => {
      const next = { ...prev };
      vehicle.customizationCategories.forEach((cat) => {
        if (!next[cat] && optionsByCategory[cat]?.[0]) next[cat] = optionsByCategory[cat][0].key;
      });
      return next;
    });
  }, [vehicle, optionsByCategory]);

  const handleSelect = (category, key) => {
    setSelection((prev) => ({ ...prev, [category]: key }));
    const opt = optionsByCategory[category]?.find((o) => o.key === key);
    if (opt?.imageUrl) setActivePhotoUrl(opt.imageUrl);
  };

  const handleReset = () => {
    const defaults = {};
    vehicle.customizationCategories.forEach((cat) => {
      if (optionsByCategory[cat]?.[0]) defaults[cat] = optionsByCategory[cat][0].key;
    });
    setSelection(defaults);
    setActivePhotoUrl(vehicle.baseImageUrl);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex flex-1 flex-col md:flex-row">
          <CustomizerSidebar activeStep="customize" />
          <main className="flex-1 flex items-center justify-center p-8">
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex flex-1 flex-col md:flex-row">
          <CustomizerSidebar activeStep="customize" />
          <main className="flex-1 flex items-center justify-center p-8">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 border-t-primary-red animate-spin" />
              Loading vehicle…
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="h-auto sm:h-16 px-6 py-3 sm:py-0 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 border-b border-gray-200 bg-white shrink-0">
        <span className="text-lg font-semibold tracking-tight">
          MOTO<span className="text-primary-red">FIX</span>
        </span>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">Vehicle</span>
          <span className="font-medium text-gray-900">
            {vehicle.make} {vehicle.model}
          </span>
          <Link to="/customize" className="text-primary-red hover:text-dark-red transition-colors font-medium">
            Change vehicle
          </Link>
        </div>
        <div className="sm:ml-auto flex items-center gap-3">
          <button type="button" disabled className="text-xs text-gray-300 cursor-not-allowed flex items-center gap-1.5">
            Save
          </button>
          <button type="button" disabled className="bg-gray-100 text-gray-300 cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium">
            View Summary
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <CustomizerSidebar activeStep="customize" />

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8 py-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                <span className="text-primary-red">Visual</span> Customizer
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Options with a real photo update the picture below; others are saved as part of your build.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="border border-primary-red text-primary-red text-sm font-medium px-4 py-2 rounded-lg hover:bg-light-red-bg transition-colors shrink-0"
            >
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 flex items-center justify-center min-h-[280px]">
              <img
                src={activePhotoUrl || vehicle.baseImageUrl}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full max-h-[420px] object-contain"
              />
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-5">
              {vehicle.customizationCategories.map((cat) => (
                <CategorySection
                  key={cat}
                  category={cat}
                  options={optionsByCategory[cat] || []}
                  selected={selection[cat]}
                  onSelect={(key) => handleSelect(cat, key)}
                  isOpen={openCategory === cat}
                  onToggle={() => setOpenCategory((prev) => (prev === cat ? null : cat))}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
