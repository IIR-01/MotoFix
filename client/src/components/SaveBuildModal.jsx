import { useEffect, useState } from 'react';

export default function SaveBuildModal({ open, initialName, saving, error, onSave, onClose }) {
  const [name, setName] = useState(initialName || '');

  useEffect(() => {
    if (open) setName(initialName || '');
  }, [open, initialName]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
        <h2 className="font-semibold text-lg text-gray-900 mb-1">Save Build</h2>
        <p className="text-sm text-gray-500 mb-4">
          Give this build a name so you can find it later in My Garage.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(name.trim());
          }}
        >
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. My City Cruiser"
            className="w-full border border-gray-300 focus:border-primary-red focus:outline-none rounded-lg px-3 py-2 text-sm mb-3"
            required
          />
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="text-sm text-gray-500 px-3 py-2">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="bg-primary-red hover:bg-dark-red disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {saving ? 'Saving…' : 'Save Build'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
