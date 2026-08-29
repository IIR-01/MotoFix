import { useState } from 'react';
import { apiFetch } from '../api/client';
import { CATEGORY_META } from '../constants/customizationCategories';

function SparkleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  );
}

export default function AiAdvisorModal({ open, onClose, vehicle, optionsByCategory, customizationCategories, onApply }) {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [applied, setApplied] = useState(new Set());

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);
    setApplied(new Set());
    try {
      const categories = customizationCategories
        .filter((cat) => optionsByCategory[cat]?.length)
        .map((cat) => ({
          category: cat,
          options: optionsByCategory[cat].map((o) => ({ key: o.key, label: o.label })),
        }));
      const data = await apiFetch('/customization/ai-advisor', {
        method: 'POST',
        body: JSON.stringify({
          vehicle: { make: vehicle.make, model: vehicle.model, year: vehicle.year, bodyType: vehicle.bodyType },
          goal,
          categories,
        }),
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyOne = (rec) => {
    onApply([rec]);
    setApplied((prev) => new Set(prev).add(rec.category));
  };

  const applyAll = () => {
    if (!result) return;
    onApply(result.recommendations);
    setApplied(new Set(result.recommendations.map((r) => r.category)));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-1">
          <h2 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
            <SparkleIcon className="w-5 h-5 text-primary-red" /> AI Mod Advisor
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">
            Close
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Describe what you&apos;re going for and we&apos;ll suggest mods from what&apos;s available for your vehicle.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder='e.g. "I want a sportier look for city driving"'
            rows={3}
            className="w-full border border-gray-300 focus:border-primary-red focus:outline-none rounded-lg px-3 py-2 text-sm resize-none"
            required
          />
          <button
            type="submit"
            disabled={loading || !goal.trim()}
            className="self-start bg-primary-red hover:bg-dark-red disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {loading && <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
            {loading ? 'Thinking…' : 'Get Suggestions'}
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}

        {result && (
          <div>
            <p className="text-sm text-gray-700 mb-4">{result.summary}</p>
            {result.recommendations.length === 0 ? (
              <p className="text-sm text-gray-400">
                No confident suggestions for that goal — try describing it differently.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex justify-end">
                  <button type="button" onClick={applyAll} className="text-xs font-medium text-primary-red hover:text-dark-red">
                    Apply All
                  </button>
                </div>
                {result.recommendations.map((rec) => {
                  const meta = CATEGORY_META[rec.category];
                  const option = optionsByCategory[rec.category]?.find((o) => o.key === rec.key);
                  return (
                    <div key={rec.category} className="border border-gray-200 rounded-lg p-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {meta?.label || rec.category}: {option?.label || rec.key}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{rec.reason}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => applyOne(rec)}
                        disabled={applied.has(rec.category)}
                        className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-md border border-primary-red text-primary-red hover:bg-light-red-bg disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                      >
                        {applied.has(rec.category) ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
