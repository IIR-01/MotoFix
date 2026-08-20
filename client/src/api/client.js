const API_BASE = 'http://localhost:5000/api';

// Every teammate's pages call the backend through this one helper, so the
// auth token is attached automatically and errors are handled consistently.
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('motofix_token');

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
  } catch (networkErr) {
    // The raw fetch() call itself failed — the backend isn't reachable at
    // all (not running, wrong port, etc). This is what "Failed to fetch"
    // actually means; surface something a person can act on instead.
    throw new Error(
      "Can't reach the MotoFix server. Make sure the backend is running (npm run dev in server/) on port 5000."
    );
  }

  // A 401 means the token is missing, invalid, or expired — not just "this
  // one request failed". Clear it and bounce to login everywhere in the app,
  // instead of leaving a half-broken page on screen with silent fetch errors.
  if (res.status === 401) {
    localStorage.removeItem('motofix_token');
    localStorage.removeItem('motofix_user');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Your session expired. Please log in again.');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}