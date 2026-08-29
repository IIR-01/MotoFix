import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CATEGORY_META } from '../constants/customizationCategories';
import { apiFetch } from '../api/client';

export default function SharedBuild() {
  const { token } = useParams();
  const [build, setBuild] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/builds/shared/${token}`)
      .then(setBuild)
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-16 px-6 flex items-center border-b border-gray-200 bg-white shrink-0">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          MOTO<span className="text-primary-red">FIX</span>
        </Link>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-8 py-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
        )}

        {!build && !error && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 border-t-primary-red animate-spin" />
            Loading shared build…
          </div>
        )}

        {build && (
          <>
            <p className="text-xs font-medium text-primary-red uppercase tracking-wide mb-1">Shared build &middot; read-only</p>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-6">{build.name}</h1>

            <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row gap-6 mb-6">
              <div className="w-full sm:w-64 h-40 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src={build.previewImageUrl || build.vehicle.baseImageUrl}
                  alt={build.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {build.vehicle.make} {build.vehicle.model}
                </p>
                <span className="inline-block bg-light-red-bg text-primary-red text-xs font-medium px-2 py-0.5 rounded-full mt-1">
                  {build.vehicle.year}
                </span>
              </div>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
              <p className="font-semibold text-gray-900 mb-4">Selected Modifications</p>
              <dl className="flex flex-col gap-2">
                {build.selection.map((s) => (
                  <div key={s.category} className="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-b-0">
                    <dt className="text-gray-500">{CATEGORY_META[s.category]?.label || s.category}</dt>
                    <dd className="text-gray-800 font-medium">{s.label}</dd>
                  </div>
                ))}
                {build.selection.length === 0 && <p className="text-sm text-gray-400">No customizations selected.</p>}
              </dl>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
