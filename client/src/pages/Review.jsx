import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import CustomizerSidebar from '../components/CustomizerSidebar';
import SaveBuildModal from '../components/SaveBuildModal';
import { CATEGORY_META } from '../constants/customizationCategories';
import { useOptionsByCategory } from '../hooks/useOptionsByCategory';
import { loadDraft, clearDraft } from '../utils/customBuildDraft';
import { apiFetch } from '../api/client';

export default function Review() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const make = searchParams.get('make');
  const model = searchParams.get('model');
  const year = searchParams.get('year');
  const buildIdParam = searchParams.get('buildId');

  const [vehicle, setVehicle] = useState(null);
  const [allOptions, setAllOptions] = useState([]);
  // selection is either the denormalized array from a saved build, or the
  // freeform {category: key} map left behind by an in-progress draft.
  const [build, setBuild] = useState(null);
  const [buildId, setBuildId] = useState(buildIdParam);
  const [error, setError] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [copied, setCopied] = useState(false);

  const queryString = useMemo(
    () => (make && model && year ? new URLSearchParams({ make, model, year, ...(buildId && { buildId }) }).toString() : ''),
    [make, model, year, buildId]
  );

  useEffect(() => {
    if (!make || !model || !year) {
      navigate('/customize');
      return;
    }
    apiFetch(`/customization/vehicles/lookup?${new URLSearchParams({ make, model, year })}`)
      .then(setVehicle)
      .catch((err) => setError(err.message));
  }, [make, model, year, navigate]);

  useEffect(() => {
    if (!vehicle) return;
    apiFetch(`/customization/options?bodyType=${encodeURIComponent(vehicle.bodyType)}`)
      .then(setAllOptions)
      .catch((err) => setError(err.message));
  }, [vehicle]);

  const optionsByCategory = useOptionsByCategory(vehicle, allOptions);

  useEffect(() => {
    if (buildIdParam) {
      apiFetch(`/builds/${buildIdParam}`)
        .then((saved) =>
          setBuild({
            selection: saved.selection,
            previewImageUrl: saved.previewImageUrl,
            name: saved.name,
            shareToken: saved.shareToken,
          })
        )
        .catch((err) => setError(err.message));
      return;
    }
    const draft = loadDraft(make, model, year);
    if (!draft) {
      setError('No in-progress build found — head back to Customize to make your selections.');
      return;
    }
    setBuild({ selection: draft.selection, previewImageUrl: draft.activePhotoUrl });
  }, [buildIdParam, make, model, year]);

  const selMap = useMemo(() => {
    if (!build) return {};
    return Array.isArray(build.selection)
      ? Object.fromEntries(build.selection.map((s) => [s.category, s.key]))
      : build.selection;
  }, [build]);

  const rows = useMemo(() => {
    if (!vehicle) return [];
    return vehicle.customizationCategories
      .filter((cat) => selMap[cat])
      .map((cat) => ({
        category: cat,
        label: CATEGORY_META[cat]?.label || cat,
        optionLabel: optionsByCategory[cat]?.find((o) => o.key === selMap[cat])?.label || selMap[cat],
      }));
  }, [vehicle, selMap, optionsByCategory]);

  const shareUrl = build?.shareToken ? `${window.location.origin}/shared/${build.shareToken}` : null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (name) => {
    setSaving(true);
    setSaveError('');
    try {
      const selectionArray = Object.entries(selMap).map(([category, key]) => ({
        category,
        key,
        label: optionsByCategory[category]?.find((o) => o.key === key)?.label || key,
      }));
      const payload = {
        name,
        vehicle: {
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          bodyType: vehicle.bodyType,
          baseImageUrl: vehicle.baseImageUrl,
        },
        selection: selectionArray,
        previewImageUrl: build.previewImageUrl || vehicle.baseImageUrl,
      };
      const saved = buildId
        ? await apiFetch(`/builds/${buildId}`, { method: 'PUT', body: JSON.stringify(payload) })
        : await apiFetch('/builds', { method: 'POST', body: JSON.stringify(payload) });

      setBuildId(saved._id);
      setBuild({
        selection: saved.selection,
        previewImageUrl: saved.previewImageUrl,
        name: saved.name,
        shareToken: saved.shareToken,
      });
      clearDraft(make, model, year);
      setShowSaveModal(false);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="h-16 px-6 flex items-center gap-4 border-b border-gray-200 bg-white shrink-0">
        <span className="text-lg font-semibold tracking-tight">
          MOTO<span className="text-primary-red">FIX</span>
        </span>
        {vehicle && (
          <span className="text-sm text-gray-500">
            Reviewing {vehicle.make} {vehicle.model} ({vehicle.year})
          </span>
        )}
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <CustomizerSidebar activeStep="review" queryString={queryString} />

        <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-8 py-8">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              <span className="text-primary-red">Review</span> Your Build
            </h1>
            <Link
              to={`/customize/build?${queryString}`}
              className="text-sm text-primary-red hover:text-dark-red font-medium"
            >
              &larr; Back to Customize
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
          )}

          {build && vehicle && (
            <>
              <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row gap-6 mb-6">
                <div className="w-full sm:w-64 h-40 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    src={build.previewImageUrl || vehicle.baseImageUrl}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{build.name || `${vehicle.make} ${vehicle.model}`}</p>
                  <dl className="mt-4 flex flex-col gap-2">
                    {rows.map((r) => (
                      <div key={r.category} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                        <dt className="text-gray-500">{r.label}</dt>
                        <dd className="text-gray-800 font-medium">{r.optionLabel}</dd>
                      </div>
                    ))}
                    {rows.length === 0 && <p className="text-sm text-gray-400">No customizations selected yet.</p>}
                  </dl>
                </div>
              </div>

              <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-gray-900">{build.shareToken ? 'Saved to My Garage' : 'Not saved yet'}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {build.shareToken
                      ? 'Anyone with the link below can view this build (read-only).'
                      : 'Save this build to revisit or share it later.'}
                  </p>
                  {saveError && <p className="text-sm text-red-600 mt-2">{saveError}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                  {shareUrl && (
                    <>
                      <input
                        readOnly
                        value={shareUrl}
                        onFocus={(e) => e.target.select()}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 w-56"
                      />
                      <button type="button" onClick={handleCopy} className="text-xs font-medium text-primary-red hover:text-dark-red">
                        {copied ? 'Copied!' : 'Copy Link'}
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowSaveModal(true)}
                    className="bg-primary-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-dark-red transition-colors"
                  >
                    {build.shareToken ? 'Update Build' : 'Save Build'}
                  </button>
                </div>
              </div>

              {build.shareToken && (
                <div className="mt-4">
                  <Link to="/garage" className="text-sm text-primary-red hover:text-dark-red font-medium">
                    Go to My Garage &rarr;
                  </Link>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <SaveBuildModal
        open={showSaveModal}
        initialName={build?.name}
        saving={saving}
        error={saveError}
        onSave={handleSave}
        onClose={() => setShowSaveModal(false)}
      />
    </div>
  );
}
