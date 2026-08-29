// An in-progress (unsaved) build's selection is kept in sessionStorage, keyed
// by vehicle, so navigating Customize -> Review -> back doesn't lose it even
// though it isn't saved to the server yet.
const draftKey = (make, model, year) => `motofix_draft:${make}:${model}:${year}`;

export function saveDraft(make, model, year, data) {
  try {
    sessionStorage.setItem(draftKey(make, model, year), JSON.stringify(data));
  } catch {
    // Best-effort only — private browsing / quota issues shouldn't break customizing.
  }
}

export function loadDraft(make, model, year) {
  try {
    const raw = sessionStorage.getItem(draftKey(make, model, year));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearDraft(make, model, year) {
  try {
    sessionStorage.removeItem(draftKey(make, model, year));
  } catch {
    // ignore
  }
}
